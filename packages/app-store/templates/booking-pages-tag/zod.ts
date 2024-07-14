import { eventTypeAppCardZod } from "@sln/app-store/eventTypeAppCardZod";
import { z } from "zod";

export const appDataSchema = eventTypeAppCardZod.merge(
  z.object({
    trackingId: z.string(),
  })
);

export const appKeysSchema = z.object({});
