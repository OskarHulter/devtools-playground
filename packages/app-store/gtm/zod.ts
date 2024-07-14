import { eventTypeAppCardZod } from "@sln/app-store/eventTypeAppCardZod";
import { z } from "zod";

export const appDataSchema = eventTypeAppCardZod.merge(
  z.object({
    trackingId: z.string().transform((val) => {
      let trackingId = val.trim();
      // Ensure that trackingId is transformed if needed to begin with "GTM-" always
      trackingId = !trackingId.startsWith("GTM-")
        ? `GTM-${trackingId}`
        : trackingId;
      return trackingId;
    }),
  })
);

export const appKeysSchema = z.object({});
