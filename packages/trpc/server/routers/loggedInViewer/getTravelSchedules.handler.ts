import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type GetTravelSchedulesOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const getTravelSchedulesHandler = async ({
  ctx,
}: GetTravelSchedulesOptions) => {
  const allTravelSchedules = await prisma.travelSchedule.findMany({
    where: {
      userId: ctx.user.id,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      timeZone: true,
    },
  });

  return allTravelSchedules;
};
