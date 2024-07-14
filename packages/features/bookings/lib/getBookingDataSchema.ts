import type { getBookingFieldsWithSystemFields } from "./getBookingFields";
import getBookingResponsesSchema from "./getBookingResponsesSchema";
import { extendedBookingCreateBody } from "@sln/prisma/zod-utils";
import { z } from "zod";

const getBookingDataSchema = ({
  view = "booking",
  bookingFields,
}: {
  view: "booking" | "reschedule";
  bookingFields: Awaited<ReturnType<typeof getBookingFieldsWithSystemFields>>;
}) => {
  return extendedBookingCreateBody.merge(
    z.object({ responses: getBookingResponsesSchema({ bookingFields, view }) })
  );
};

export type TgetBookingDataSchema = z.infer<
  ReturnType<typeof getBookingDataSchema>
>;

export default getBookingDataSchema;
