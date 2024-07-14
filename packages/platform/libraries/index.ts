import { CalendarService } from "@sln/app-store/applecalendar/lib";
import { getBookingForReschedule } from "@sln/features/bookings/lib/get-booking";
import getBookingInfo from "@sln/features/bookings/lib/getBookingInfo";
import handleCancelBooking from "@sln/features/bookings/lib/handleCancelBooking";
import * as newBookingMethods from "@sln/features/bookings/lib/handleNewBooking";
import { getPublicEvent } from "@sln/features/eventtypes/lib/getPublicEvent";
import handleMarkNoShow from "@sln/features/handleMarkNoShow";
import * as instantMeetingMethods from "@sln/features/instant-meeting/handleInstantMeeting";
import getAllUserBookings from "@sln/lib/bookings/getAllUserBookings";
import { symmetricEncrypt } from "@sln/lib/crypto";
import { updateHandler as updateScheduleHandler } from "@sln/trpc/server/routers/viewer/availability/schedule/update.handler";
import { getAvailableSlots } from "@sln/trpc/server/routers/viewer/slots/util";
import { createNewUsersConnectToOrgIfExists } from "@sln/trpc/server/routers/viewer/teams/inviteMember/utils";

export { slugify } from "@sln/lib/slugify";
export { getBookingForReschedule };
export { updateScheduleHandler };
export type UpdateScheduleOutputType = Awaited<
  ReturnType<
    typeof import("@sln/trpc/server/routers/viewer/availability/schedule/update.handler").updateHandler
  >
>;
export { getEventTypeById } from "@sln/lib/event-types/getEventTypeById";
export { getEventTypesByViewer } from "@sln/lib/event-types/getEventTypesByViewer";
export { getEventTypesPublic } from "@sln/lib/event-types/getEventTypesPublic";
export { createHandler as createEventType } from "@sln/trpc/server/routers/viewer/eventTypes/create.handler";
export { updateHandler as updateEventType } from "@sln/trpc/server/routers/viewer/eventTypes/update.handler";

export { SchedulingType, PeriodType } from "@sln/prisma/enums";

export type { EventType } from "@sln/lib/event-types/getEventTypeById";
export type { EventTypesByViewer } from "@sln/lib/event-types/getEventTypesByViewer";
export type { EventTypesPublic } from "@sln/lib/event-types/getEventTypesPublic";
export type { UpdateEventTypeReturn } from "@sln/trpc/server/routers/viewer/eventTypes/update.handler";

export type PublicEventType = Awaited<ReturnType<typeof getPublicEvent>>;
export { getPublicEvent };
export { getUsernameList } from "@sln/lib/defaultEvents";

const handleNewBooking = newBookingMethods.default;
export { handleNewBooking };
const handleInstantMeeting = instantMeetingMethods.default;
export { handleInstantMeeting };

export { handleMarkNoShow };

export { getAvailableSlots };
export type AvailableSlotsType = Awaited<ReturnType<typeof getAvailableSlots>>;
export { handleNewRecurringBooking } from "@sln/features/bookings/lib/handleNewRecurringBooking";

export { getConnectedDestinationCalendars } from "@sln/lib/getConnectedDestinationCalendars";
export type { ConnectedDestinationCalendars } from "@sln/lib/getConnectedDestinationCalendars";
export { getBusyCalendarTimes } from "@sln/core/CalendarManager";

export {
  transformWorkingHoursForAtom,
  transformAvailabilityForAtom,
  transformDateOverridesForAtom,
  transformApiScheduleAvailability,
  transformApiScheduleOverrides,
} from "@sln/lib/schedules/transformers";

export type {
  BookingCreateBody,
  BookingResponse,
  RecurringBookingCreateBody,
} from "@sln/features/bookings/types";
export { HttpError } from "@sln/lib/http-error";
export type { AppsStatus } from "@sln/types/Calendar";

export { MINUTES_TO_BOOK } from "@sln/lib/constants";

export { cityTimezonesHandler } from "@sln/lib/cityTimezonesHandler";
export type { CityTimezones } from "@sln/lib/cityTimezonesHandler";

export { TRPCError } from "@trpc/server";
export type { TUpdateInputSchema } from "@sln/trpc/server/routers/viewer/availability/schedule/update.schema";

export { createNewUsersConnectToOrgIfExists };

export { getAllUserBookings };
export { getBookingInfo };
export { handleCancelBooking };

export {
  eventTypeBookingFields,
  eventTypeLocations,
} from "@sln/prisma/zod-utils";

export { EventTypeMetaDataSchema, userMetadata } from "@sln/prisma/zod-utils";

export {
  transformApiEventTypeBookingFields,
  transformApiEventTypeLocations,
  getResponseEventTypeLocations,
  getResponseEventTypeBookingFields,
  TransformedLocationsSchema,
  BookingFieldsSchema,
} from "@sln/lib/event-types/transformers";

export { parseRecurringEvent } from "@sln/lib/isRecurringEvent";
export { dynamicEvent } from "@sln/lib/defaultEvents";

export { symmetricEncrypt };
export { CalendarService };
