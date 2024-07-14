import type { TGetInputSchema } from "./get.schema";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetInputSchema;
};

export const getHandler = async ({ ctx: _ctx, input }: GetOptions) => {
  return await prisma.webhook.findUniqueOrThrow({
    where: {
      id: input.webhookId,
    },
    select: {
      id: true,
      subscriberUrl: true,
      payloadTemplate: true,
      active: true,
      eventTriggers: true,
      secret: true,
      teamId: true,
      userId: true,
      platform: true,
    },
  });
};
