import type { TEventInputSchema } from "./event.schema";
import { getPublicEvent } from "@sln/features/eventtypes/lib/getPublicEvent";
import type { PrismaClient } from "@sln/prisma";

interface EventHandlerOptions {
  ctx: { prisma: PrismaClient };
  input: TEventInputSchema;
}

export const eventHandler = async ({ ctx, input }: EventHandlerOptions) => {
  const event = await getPublicEvent(
    input.username,
    input.eventSlug,
    input.isTeamEvent,
    input.org,
    ctx.prisma,
    input.fromRedirectOfNonOrgLink
  );
  return event;
};

export default eventHandler;
