import type { PrismaClient } from "@sln/prisma";

export async function maybeGetBookingUidFromSeat(
  prisma: PrismaClient,
  uid: string
) {
  // Look bookingUid in bookingSeat
  const bookingSeat = await prisma.bookingSeat.findUnique({
    where: {
      referenceUid: uid,
    },
    select: {
      booking: {
        select: {
          id: true,
          uid: true,
        },
      },
    },
  });
  if (bookingSeat)
    return { uid: bookingSeat.booking.uid, seatReferenceUid: uid };
  return { uid };
}
