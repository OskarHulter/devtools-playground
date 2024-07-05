import type z from "zod";

import type { schemaBookingCancelParams } from "@sln/prisma/zod-utils";

export function getMockRequestDataForCancelBooking(
	data: z.infer<typeof schemaBookingCancelParams>,
) {
	return data;
}
