import { eventTypeAppCardZod } from "@sln/app-store/eventTypeAppCardZod";
import { z } from "zod";

export const appDataSchema = eventTypeAppCardZod.merge(
  z.object({
    SITE_ID: z.string().optional(),
  })
);

export const appKeysSchema = z.object({});
