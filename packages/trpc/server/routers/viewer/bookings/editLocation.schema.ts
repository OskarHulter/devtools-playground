import { commonBookingSchema } from "./types";
import { DailyLocationType } from "@sln/app-store/locations";
import { z } from "zod";

export const ZEditLocationInputSchema = commonBookingSchema.extend({
  newLocation: z.string().transform((val) => val || DailyLocationType),
  details: z.object({ credentialId: z.number().optional() }).optional(),
});

export type TEditLocationInputSchema = z.infer<typeof ZEditLocationInputSchema>;
