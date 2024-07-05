import { z } from "zod";

import { extendedBookingCreateBody } from "@sln/prisma/zod-utils";

import type { getReviewFieldsWithSystemFields } from "./getReviewFields";
import getReviewResponsesSchema from "./getReviewResponsesSchema";

const getReviewDataSchema = ({
	view = "booking",
	bookingFields,
}: {
	view: "booking" | "reschedule";
	bookingFields: Awaited<ReturnType<typeof getReviewFieldsWithSystemFields>>;
}) => {
	return extendedBookingCreateBody.merge(
		z.object({ responses: getReviewResponsesSchema({ bookingFields, view }) }),
	);
};

export default getReviewDataSchema;
