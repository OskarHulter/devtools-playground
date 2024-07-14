import type { RecurringBookingCreateBody, BookingResponse } from "../types";
import { post } from "@sln/lib/fetch-wrapper";

export const createRecurringBooking = async (
  data: RecurringBookingCreateBody[]
) => {
  const response = await post<RecurringBookingCreateBody[], BookingResponse[]>(
    "/api/book/recurring-event",
    data
  );
  return response;
};
