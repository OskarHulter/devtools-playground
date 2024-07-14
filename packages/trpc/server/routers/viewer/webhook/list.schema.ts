import { webhookIdAndEventTypeIdSchema } from "./types";
import { WEBHOOK_TRIGGER_EVENTS } from "@sln/features/webhooks/lib/constants";
import { z } from "zod";

export const ZListInputSchema = webhookIdAndEventTypeIdSchema
  .extend({
    appId: z.string().optional(),
    teamId: z.number().optional(),
    eventTypeId: z.number().optional(),
    eventTriggers: z.enum(WEBHOOK_TRIGGER_EVENTS).array().optional(),
  })
  .optional();

export type TListInputSchema = z.infer<typeof ZListInputSchema>;
