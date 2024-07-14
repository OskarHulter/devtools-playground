import type { TEditInputSchema } from "./edit.schema";
import {
  updateTriggerForExistingBookings,
  deleteWebhookScheduledTriggers,
} from "@sln/features/webhooks/lib/scheduleTrigger";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type EditOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TEditInputSchema;
};

export const editHandler = async ({ input, ctx }: EditOptions) => {
  const { id, ...data } = input;

  const webhook = await prisma.webhook.findFirst({
    where: {
      id,
    },
  });

  if (!webhook) {
    return null;
  }

  if (webhook.platform) {
    const { user } = ctx;
    if (user?.role !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }

  const updatedWebhook = await prisma.webhook.update({
    where: {
      id,
    },
    data,
  });

  if (data.active) {
    const activeTriggersBefore = webhook.active ? webhook.eventTriggers : [];
    await updateTriggerForExistingBookings(
      webhook,
      activeTriggersBefore,
      updatedWebhook.eventTriggers
    );
  } else if (!data.active && webhook.active) {
    await deleteWebhookScheduledTriggers({ webhookId: webhook.id });
  }

  return updatedWebhook;
};
