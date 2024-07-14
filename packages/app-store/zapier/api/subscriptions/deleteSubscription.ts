import { validateAccountOrApiKey } from "../../lib/validateAccountOrApiKey";
import { deleteSubscription } from "@sln/features/webhooks/lib/scheduleTrigger";
import { defaultHandler, defaultResponder } from "@sln/lib/server";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

const querySchema = z.object({
  apiKey: z.string(),
  id: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = querySchema.parse(req.query);

  const { account, appApiKey } = await validateAccountOrApiKey(req, [
    "READ_BOOKING",
    "READ_PROFILE",
  ]);

  const deleteEventSubscription = await deleteSubscription({
    appApiKey,
    account,
    webhookId: id,
    appId: "zapier",
  });

  if (!deleteEventSubscription) {
    return res.status(500).json({ message: "Could not delete subscription." });
  }
  res.status(204).json({ message: "Subscription is deleted." });
}

export default defaultHandler({
  DELETE: Promise.resolve({ default: defaultResponder(handler) }),
});