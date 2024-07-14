import { webhookIdAndEventTypeIdSchema } from "./types";
import { WEBHOOK_TRIGGER_EVENTS } from "@sln/features/webhooks/lib/constants";
import { z } from "zod";

export const ZCreateInputSchema = webhookIdAndEventTypeIdSchema.extend({
  subscriberUrl: z.string().url(),
  eventTriggers: z.enum(WEBHOOK_TRIGGER_EVENTS).array(),
  active: z.boolean(),
  payloadTemplate: z.string().nullable(),
  eventTypeId: z.number().optional(),
  appId: z.string().optional().nullable(),
  secret: z.string().optional().nullable(),
  teamId: z.number().optional(),
  platform: z.boolean().optional(),
});

export type TCreateInputSchema = z.infer<typeof ZCreateInputSchema>;
