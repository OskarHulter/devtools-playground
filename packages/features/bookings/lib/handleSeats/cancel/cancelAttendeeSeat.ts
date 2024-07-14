import type { CustomRequest } from "../../handleCancelBooking";
import { getCalendar } from "@sln/app-store/_utils/getCalendar";
import { updateMeeting } from "@sln/core/videoClient";
import { sendCancelledSeatEmails } from "@sln/emails";
import sendPayload from "@sln/features/webhooks/lib/sendOrSchedulePayload";
import type { EventTypeInfo } from "@sln/features/webhooks/lib/sendPayload";
import { HttpError } from "@sln/lib/http-error";
import logger from "@sln/lib/logger";
import { safeStringify } from "@sln/lib/safeStringify";
import { getTranslation } from "@sln/lib/server/i18n";
import prisma from "@sln/prisma";
import { WebhookTriggerEvents } from "@sln/prisma/enums";
import { credentialForCalendarServiceSelect } from "@sln/prisma/selects/credential";
import { schemaBookingCancelParams } from "@sln/prisma/zod-utils";
import { deleteAllWorkflowReminders } from "@sln/trpc/server/routers/viewer/workflows/util";
import type { CalendarEvent } from "@sln/types/Calendar";

async function cancelAttendeeSeat(
  req: CustomRequest,
  dataForWebhooks: {
    webhooks: {
      id: string;
      subscriberUrl: string;
      payloadTemplate: string | null;
      appId: string | null;
      secret: string | null;
    }[];
    evt: CalendarEvent;
    eventTypeInfo: EventTypeInfo;
  }
) {
  const { seatReferenceUid } = schemaBookingCancelParams.parse(req.body);
  const { webhooks, evt, eventTypeInfo } = dataForWebhooks;
  if (!seatReferenceUid) return;
  const bookingToDelete = req.bookingToDelete;
  if (
    !bookingToDelete?.attendees.length ||
    bookingToDelete.attendees.length < 2
  )
    return;

  if (!bookingToDelete.userId) {
    throw new HttpError({ statusCode: 400, message: "User not found" });
  }

  const seatReference = bookingToDelete.seatsReferences.find(
    (reference) => reference.referenceUid === seatReferenceUid
  );

  if (!seatReference)
    throw new HttpError({
      statusCode: 400,
      message: "User not a part of this booking",
    });

  await Promise.all([
    prisma.bookingSeat.delete({
      where: {
        referenceUid: seatReferenceUid,
      },
    }),
    prisma.attendee.delete({
      where: {
        id: seatReference.attendeeId,
      },
    }),
  ]);
  req.statusCode = 200;

  const attendee = bookingToDelete?.attendees.find(
    (attendee) => attendee.id === seatReference.attendeeId
  );

  if (attendee) {
    /* If there are references then we should update them as well */

    const integrationsToUpdate = [];

    for (const reference of bookingToDelete.references) {
      if (reference.credentialId) {
        const credential = await prisma.credential.findUnique({
          where: {
            id: reference.credentialId,
          },
          select: credentialForCalendarServiceSelect,
        });

        if (credential) {
          const updatedEvt = {
            ...evt,
            attendees: evt.attendees.filter(
              (evtAttendee) => attendee.email !== evtAttendee.email
            ),
          };
          if (reference.type.includes("_video")) {
            integrationsToUpdate.push(
              updateMeeting(credential, updatedEvt, reference)
            );
          }
          if (reference.type.includes("_calendar")) {
            const calendar = await getCalendar(credential);
            if (calendar) {
              integrationsToUpdate.push(
                calendar?.updateEvent(
                  reference.uid,
                  updatedEvt,
                  reference.externalCalendarId
                )
              );
            }
          }
        }
      }
    }

    try {
      await Promise.all(integrationsToUpdate);
    } catch (error) {
      // Shouldn't stop code execution if integrations fail
      // as integrations was already updated
    }

    const tAttendees = await getTranslation(attendee.locale ?? "en", "common");

    await sendCancelledSeatEmails(evt, {
      ...attendee,
      language: { translate: tAttendees, locale: attendee.locale ?? "en" },
    });
  }

  evt.attendees = attendee
    ? [
        {
          ...attendee,
          language: {
            translate: await getTranslation(attendee.locale ?? "en", "common"),
            locale: attendee.locale ?? "en",
          },
        },
      ]
    : [];

  const promises = webhooks.map((webhook) =>
    sendPayload(
      webhook.secret,
      WebhookTriggerEvents.BOOKING_CANCELLED,
      new Date().toISOString(),
      webhook,
      {
        ...evt,
        ...eventTypeInfo,
        status: "CANCELLED",
        smsReminderNumber: bookingToDelete.smsReminderNumber || undefined,
      }
    ).catch((e) => {
      logger.error(
        `Error executing webhook for event: ${WebhookTriggerEvents.BOOKING_CANCELLED}, URL: ${webhook.subscriberUrl}, bookingId: ${evt.bookingId}, bookingUid: ${evt.uid}`,
        safeStringify(e)
      );
    })
  );
  await Promise.all(promises);

  const workflowRemindersForAttendee =
    bookingToDelete?.workflowReminders.filter(
      (reminder) => reminder.seatReferenceId === seatReferenceUid
    ) ?? null;

  await deleteAllWorkflowReminders(workflowRemindersForAttendee);

  return { success: true };
}

export default cancelAttendeeSeat;
