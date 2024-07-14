import type { TConnectedCalendarsInputSchema } from "./connectedCalendars.schema";
import { getConnectedDestinationCalendars } from "@sln/lib/getConnectedDestinationCalendars";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type ConnectedCalendarsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TConnectedCalendarsInputSchema;
};

export const connectedCalendarsHandler = async ({
  ctx,
  input,
}: ConnectedCalendarsOptions) => {
  const { user } = ctx;
  const onboarding = input?.onboarding || false;

  const { connectedCalendars, destinationCalendar } =
    await getConnectedDestinationCalendars(user, onboarding, prisma);

  return {
    connectedCalendars,
    destinationCalendar,
  };
};
