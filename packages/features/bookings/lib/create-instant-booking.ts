import type { BookingCreateBody, InstantBookingResponse } from "../types";
import { post } from "@sln/lib/fetch-wrapper";

export const createInstantBooking = async (data: BookingCreateBody) => {
  const response = await post<BookingCreateBody, InstantBookingResponse>(
    "/api/book/instant-event",
    data
  );
  return response;
};
