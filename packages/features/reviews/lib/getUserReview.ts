import prisma from "@sln/prisma";

const getUserReview = async (uid: string) => {
	const reviewInfo = await prisma.review.findFirst({
		where: {
			uid: uid,
		},
		select: {
			title: true,
			id: true,
			uid: true,
			description: true,
			customInputs: true,
			smsReminderNumber: true,
			recurringEventId: true,
			startTime: true,
			endTime: true,
			location: true,
			status: true,
			metadata: true,
			cancellationReason: true,
			responses: true,
			rejectionReason: true,
			userPrimaryEmail: true,
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					username: true,
					timeZone: true,
					avatarUrl: true,
				},
			},
			attendees: {
				select: {
					name: true,
					email: true,
					timeZone: true,
				},
			},
			eventTypeId: true,
			eventType: {
				select: {
					eventName: true,
					slug: true,
					timeZone: true,
					schedulingType: true,
				},
			},
			seatsReferences: {
				select: {
					referenceUid: true,
				},
			},
		},
	});

	return reviewInfo;
};

export default getUserReview;
