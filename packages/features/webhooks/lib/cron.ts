/* Cron job for scheduled webhook events triggers */
import { handleWebhookScheduledTriggers } from "./handleWebhookScheduledTriggers";
import { defaultHandler } from "@sln/lib/server";
import prisma from "@sln/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers.authorization || req.query.apiKey;
  if (process.env.CRON_API_KEY !== apiKey) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  await handleWebhookScheduledTriggers(prisma);

  res.json({ ok: true });
}

export default defaultHandler({
  POST: Promise.resolve({ default: handler }),
});
