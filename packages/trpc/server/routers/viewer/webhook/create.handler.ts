import type { TCreateInputSchema } from "./create.schema";
import type { Webhook } from "@prisma/client";
import { updateTriggerForExistingBookings } from "@sln/features/webhooks/lib/scheduleTrigger";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";

type CreateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateInputSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  let newWebhook: Webhook;
  if (input.platform) {
    const { user } = ctx;
    if (user?.role !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    newWebhook = await prisma.webhook.create({
      data: {
        id: v4(),
        ...input,
      },
    });
  } else if (input.eventTypeId || input.teamId) {
    newWebhook = await prisma.webhook.create({
      data: {
        id: v4(),
        ...input,
      },
    });
  } else {
    newWebhook = await prisma.webhook.create({
      data: {
        id: v4(),
        userId: ctx.user.id,
        ...input,
      },
    });
  }

  await updateTriggerForExistingBookings(
    newWebhook,
    [],
    newWebhook.eventTriggers
  );

  return newWebhook;
};
