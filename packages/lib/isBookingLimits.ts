import { intervalLimitsType } from "@sln/prisma/zod-utils";
import type { IntervalLimit } from "@sln/types/Calendar";

export function isBookingLimit(obj: unknown): obj is IntervalLimit {
  return intervalLimitsType.safeParse(obj).success;
}

export function parseBookingLimit(obj: unknown): IntervalLimit | null {
  let bookingLimit: IntervalLimit | null = null;
  if (isBookingLimit(obj)) bookingLimit = obj;

  return bookingLimit;
}
