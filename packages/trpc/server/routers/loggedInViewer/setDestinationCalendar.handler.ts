import type { TSetDestinationCalendarInputSchema } from "./setDestinationCalendar.schema";
import {
  getCalendarCredentials,
  getConnectedCalendars,
} from "@sln/core/CalendarManager";
import { getUsersCredentials } from "@sln/lib/server/getUsersCredentials";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type SessionUser = NonNullable<TrpcSessionUser>;
type User = {
  id: SessionUser["id"];
  selectedCalendars: SessionUser["selectedCalendars"];
};

type SetDestinationCalendarOptions = {
  ctx: {
    user: User;
  };
  input: TSetDestinationCalendarInputSchema;
};

export const setDestinationCalendarHandler = async ({
  ctx,
  input,
}: SetDestinationCalendarOptions) => {
  const { user } = ctx;
  const { integration, externalId, eventTypeId } = input;
  const credentials = await getUsersCredentials(user);
  const calendarCredentials = getCalendarCredentials(credentials);
  const { connectedCalendars } = await getConnectedCalendars(
    calendarCredentials,
    user.selectedCalendars
  );
  const allCals = connectedCalendars.map((cal) => cal.calendars ?? []).flat();

  const credentialId = allCals.find(
    (cal) =>
      cal.externalId === externalId &&
      cal.integration === integration &&
      cal.readOnly === false
  )?.credentialId;

  if (!credentialId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Could not find calendar ${input.externalId}`,
    });
  }

  const primaryEmail =
    allCals.find((cal) => cal.primary && cal.credentialId === credentialId)
      ?.email ?? null;

  let where;

  if (eventTypeId) {
    if (
      !(await prisma.eventType.findFirst({
        where: {
          id: eventTypeId,
          userId: user.id,
        },
      }))
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `You don't have access to event type ${eventTypeId}`,
      });
    }

    where = { eventTypeId };
  } else where = { userId: user.id };

  await prisma.destinationCalendar.upsert({
    where,
    update: {
      integration,
      externalId,
      credentialId,
      primaryEmail,
    },
    create: {
      ...where,
      integration,
      externalId,
      credentialId,
      primaryEmail,
    },
  });
};
