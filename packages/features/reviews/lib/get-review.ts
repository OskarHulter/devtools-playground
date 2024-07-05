import type { Prisma } from "@prisma/client";
import type { z } from "zod";

import { reviewResponsesDbSchema } from "@sln/features/reviews/lib/getReviewResponsesSchema";
import slugify from "@sln/lib/slugify";
import type { PrismaClient } from "@sln/prisma";
import prisma from "@sln/prisma";

type ReviewSelect = {
	description: true;
	customInputs: true;
	attendees: {
		select: {
			email: true;
			name: true;
		};
	};
	location: true;
};

// Backward Compatibility for review created before we had managed review questions
function getResponsesFromOldReview(
	rawReview: Prisma.ReviewGetPayload<{
		select: ReviewSelect;
	}>,
) {
	const customInputs = rawReview.customInputs || {};
	const responses = Object.keys(customInputs).reduce((acc, label) => {
		acc[slugify(label) as keyof typeof acc] =
			customInputs[label as keyof typeof customInputs];
		return acc;
	}, {});
	return {
		// It is possible to have no attendees in a review when the review is cancelled.
		name: rawReview.attendees[0]?.name || "Nameless",
		email: rawReview.attendees[0]?.email || "",
		guests: rawReview.attendees.slice(1).map((attendee) => {
			return attendee.email;
		}),
		notes: rawReview.description || "",
		location: {
			value: rawReview.location || "",
			optionValue: rawReview.location || "",
		},
		...responses,
	};
}

async function getReview(
	prisma: PrismaClient,
	uid: string,
	isSeatedEvent?: boolean,
) {
	const rawReview = await prisma.review.findFirst({
		where: {
			uid,
		},
		select: {
			id: true,
			uid: true,
			startTime: true,
			endTime: true,
			description: true,
			customInputs: true,
			responses: true,
			smsReminderNumber: true,
			location: true,
			eventTypeId: true,
			attendees: {
				select: {
					email: true,
					name: true,
					reviewSeat: true,
				},
			},
			user: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!rawReview) {
		return rawReview;
	}

	const review = getReviewWithResponses(rawReview, isSeatedEvent);

	if (review) {
		// @NOTE: had to do this because Server side cant return [Object objects]
		// probably fixable with json.stringify -> json.parse
		review["startTime"] = (
			review?.startTime as Date
		)?.toISOString() as unknown as Date;
		review["endTime"] = (
			review?.endTime as Date
		)?.toISOString() as unknown as Date;
	}

	return review;
}

export type GetReviewType = Prisma.PromiseReturnType<typeof getReview>;

export const getReviewWithResponses = <
	T extends Prisma.ReviewGetPayload<{
		select: ReviewSelect & {
			responses: true;
		};
	}>,
>(
	review: T,
	isSeatedEvent?: boolean,
) => {
	return {
		...review,
		responses: isSeatedEvent
			? reviewResponsesDbSchema.parse(review.responses || {})
			: reviewResponsesDbSchema.parse(
					review.responses || getResponsesFromOldReview(review),
				),
	} as Omit<T, "responses"> & {
		responses: z.infer<typeof reviewResponsesDbSchema>;
	};
};

export default getReview;

export const getReviewForReschedule = async (uid: string, userId?: number) => {
	let rescheduleUid: string | null = null;
	const theReview = await prisma.review.findFirst({
		where: {
			uid,
		},
		select: {
			id: true,
			userId: true,
			eventType: {
				select: {
					seatsPerTimeSlot: true,
					hosts: {
						select: {
							userId: true,
						},
					},
					owner: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});
	let reviewSeatReferenceUid: number | null = null;

	// If no review is found via the uid, it's probably a review seat
	// that its being rescheduled, which we query next.
	let attendeeEmail: string | null = null;
	let reviewSeatData: {
		description?: string;
		responses: Prisma.JsonValue;
	} | null = null;
	if (!theReview) {
		const reviewSeat = await prisma.reviewSeat.findFirst({
			where: {
				referenceUid: uid,
			},
			select: {
				id: true,
				attendee: {
					select: {
						name: true,
						email: true,
					},
				},
				data: true,
				review: {
					select: {
						uid: true,
					},
				},
			},
		});
		if (reviewSeat) {
			reviewSeatData = reviewSeat.data as unknown as {
				description?: string;
				responses: Prisma.JsonValue;
			};
			reviewSeatReferenceUid = reviewSeat.id;
			rescheduleUid = reviewSeat.review.uid;
			attendeeEmail = reviewSeat.attendee.email;
		}
	}

	// If we have the review and not reviewSeat, we need to make sure the review belongs to the userLoggedIn
	// Otherwise, we return null here.
	const hasOwnershipOnReview = false;
	if (
		theReview &&
		theReview?.eventType?.seatsPerTimeSlot &&
		reviewSeatReferenceUid === null
	) {
		const isOwnerOfReview = theReview.userId === userId;

		const isHostOfEventType = theReview?.eventType?.hosts.some(
			(host) => host.userId === userId,
		);

		const isUserIdInReview = theReview.userId === userId;

		if (!isOwnerOfReview && !isHostOfEventType && !isUserIdInReview)
			return null;
		hasOwnershipOnReview = true;
	}

	// If we don't have a booking and no rescheduleUid, the ID is invalid,
	// and we return null here.
	if (!theReview && !rescheduleUid) return null;

	const booking = await getReview(
		prisma,
		rescheduleUid || uid,
		reviewSeatReferenceUid ? true : false,
	);

	if (!booking) return null;

	if (reviewSeatReferenceUid) {
		booking["description"] = reviewSeatData?.description ?? null;
		booking["responses"] = bookingResponsesDbSchema.parse(
			reviewSeatData?.responses ?? {},
		);
	}
	return {
		...booking,
		attendees: rescheduleUid
			? booking.attendees.filter((attendee) => attendee.email === attendeeEmail)
			: hasOwnershipOnReview
				? []
				: booking.attendees,
	};
};

/**
 * Should only get booking attendees length for seated events
 * @param uid
 * @returns booking with masked attendee emails
 */
export const getReviewForSeatedEvent = async (uid: string) => {
	const booking = await prisma.booking.findFirst({
		where: {
			uid,
		},
		select: {
			id: true,
			uid: true,
			startTime: true,
			endTime: true,
			attendees: {
				select: {
					id: true,
				},
			},
			eventTypeId: true,
			user: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!booking || booking.eventTypeId === null) return null;

	// Validate booking event type has seats enabled
	const eventType = await prisma.eventType.findFirst({
		where: {
			id: booking.eventTypeId,
		},
		select: {
			seatsPerTimeSlot: true,
		},
	});
	if (!eventType || eventType.seatsPerTimeSlot === null) return null;

	const result: GetReviewType = {
		...booking,
		// @NOTE: had to do this because Server side cant return [Object objects]
		startTime: booking.startTime.toISOString() as unknown as Date,
		endTime: booking.endTime.toISOString() as unknown as Date,
		description: null,
		customInputs: null,
		responses: {},
		smsReminderNumber: null,
		location: null,
		// mask attendee emails for seated events
		attendees: review.attendees.map((attendee) => ({
			...attendee,
			email: "",
			name: "",
			reviewSeat: null,
		})),
	};
	return result;
};

export const getMultipleDurationValue = (
	multipleDurationConfig: number[] | undefined,
	queryDuration: string | string[] | undefined,
	defaultValue: number,
) => {
	if (!multipleDurationConfig) return null;
	if (multipleDurationConfig.includes(Number(queryDuration)))
		return Number(queryDuration);
	return defaultValue;
};
