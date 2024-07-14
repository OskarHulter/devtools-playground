import type { OriginalRescheduledBooking } from "../../handleNewBooking/types";
import type { Attendee } from "@prisma/client";
// eslint-disable-next-line no-restricted-imports
import { getCalendar } from "@sln/app-store/_utils/getCalendar";
import { deleteMeeting } from "@sln/core/videoClient";
import prisma from "@sln/prisma";
import { BookingStatus } from "@sln/prisma/enums";
import { credentialForCalendarServiceSelect } from "@sln/prisma/selects/credential";
import type { CalendarEvent } from "@sln/types/Calendar";

/* Check if the original booking has no more attendees, if so delete the booking
  and any calendar or video integrations */
const lastAttendeeDeleteBooking = async (
  originalRescheduledBooking: OriginalRescheduledBooking,
  filteredAttendees: Partial<Attendee>[] | undefined,
  originalBookingEvt?: CalendarEvent
) => {
  let deletedReferences = false;
  if (
    (!filteredAttendees || filteredAttendees.length === 0) &&
    originalRescheduledBooking
  ) {
    const integrationsToDelete = [];

    for (const reference of originalRescheduledBooking.references) {
      if (reference.credentialId) {
        const credential = await prisma.credential.findUnique({
          where: {
            id: reference.credentialId,
          },
          select: credentialForCalendarServiceSelect,
        });

        if (credential) {
          if (reference.type.includes("_video")) {
            integrationsToDelete.push(deleteMeeting(credential, reference.uid));
          }
          if (reference.type.includes("_calendar") && originalBookingEvt) {
            const calendar = await getCalendar(credential);
            if (calendar) {
              integrationsToDelete.push(
                calendar?.deleteEvent(
                  reference.uid,
                  originalBookingEvt,
                  reference.externalCalendarId
                )
              );
            }
          }
        }
      }
    }

    await Promise.all(integrationsToDelete).then(async () => {
      await prisma.booking.update({
        where: {
          id: originalRescheduledBooking.id,
        },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });
    });
    deletedReferences = true;
  }
  return deletedReferences;
};

export default lastAttendeeDeleteBooking;
