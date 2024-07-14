import getUserBooking from "./getUserBooking";
import { getBookingWithResponses } from "@sln/features/bookings/lib/get-booking";

const getBookingInfo = async (uid: string) => {
  const bookingInfoRaw = await getUserBooking(uid);

  if (!bookingInfoRaw) {
    return { bookingInfoRaw: undefined, bookingInfo: undefined };
  }

  const bookingInfo = getBookingWithResponses(bookingInfoRaw);

  return { bookingInfoRaw, bookingInfo };
};

export default getBookingInfo;
