import {
	sendAttendeeRequestEmail,
	sendOrganizerRequestEmail,
} from "@sln/emails";
import { getWebhookPayloadForBooking } from "@sln/features/bookings/lib/getWebhookPayloadForBooking";
import getWebhooks from "@sln/features/webhooks/lib/getWebhooks";
import sendPayload from "@sln/features/webhooks/lib/sendOrSchedulePayload";
import getOrgIdFromMemberOrTeamId from "@sln/lib/getOrgIdFromMemberOrTeamId";
import logger from "@sln/lib/logger";
import { safeStringify } from "@sln/lib/safeStringify";
import { WebhookTriggerEvents } from "@sln/prisma/enums";
import type { CalendarEvent } from "@sln/types/Calendar";

const log = logger.getSubLogger({
	prefix: ["[handleBookingRequested] book:user"],
});

/**
 * Supposed to do whatever is needed when a booking is requested.
 */
export async function handleBookingRequested(args: {
	evt: CalendarEvent;
	booking: {
		eventType: {
			team?: {
				parentId: number | null;
			} | null;
			currency: string;
			description: string | null;
			id: number;
			length: number;
			price: number;
			requiresConfirmation: boolean;
			title: string;
			teamId?: number | null;
		} | null;
		eventTypeId: number | null;
		userId: number | null;
		id: number;
	};
}) {
	const { evt, booking } = args;

	log.debug("Emails: Sending booking requested emails");
	await sendOrganizerRequestEmail({ ...evt });
	await sendAttendeeRequestEmail({ ...evt }, evt.attendees[0]);

	const orgId = await getOrgIdFromMemberOrTeamId({
		memberId: booking.userId,
		teamId: booking.eventType?.teamId,
	});

	try {
		const subscribersBookingRequested = await getWebhooks({
			userId: booking.userId,
			eventTypeId: booking.eventTypeId,
			triggerEvent: WebhookTriggerEvents.BOOKING_REQUESTED,
			teamId: booking.eventType?.teamId,
			orgId,
		});

		const webhookPayload = getWebhookPayloadForBooking({
			booking,
			evt,
		});

		const promises = subscribersBookingRequested.map((sub) =>
			sendPayload(
				sub.secret,
				WebhookTriggerEvents.BOOKING_REQUESTED,
				new Date().toISOString(),
				sub,
				webhookPayload,
			).catch((e) => {
				log.error(
					`Error executing webhook for event: ${WebhookTriggerEvents.BOOKING_REQUESTED}, URL: ${sub.subscriberUrl}, bookingId: ${evt.bookingId}, bookingUid: ${evt.uid}`,
					safeStringify(e),
				);
			}),
		);
		await Promise.all(promises);
	} catch (error) {
		// Silently fail
		log.error("Error in handleBookingRequested", safeStringify(error));
	}
}
