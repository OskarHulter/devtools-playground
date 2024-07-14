import type { TEventTypeOrderInputSchema } from "./eventTypeOrder.schema";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type EventTypeOrderOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TEventTypeOrderInputSchema;
};

export const eventTypeOrderHandler = async ({
  ctx,
  input,
}: EventTypeOrderOptions) => {
  const { user } = ctx;

  const allEventTypes = await prisma.eventType.findMany({
    select: {
      id: true,
    },
    where: {
      id: {
        in: input.ids,
      },
      OR: [
        {
          userId: user.id,
        },
        {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        {
          team: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      ],
    },
  });
  const allEventTypeIds = new Set(allEventTypes.map((type) => type.id));
  if (input.ids.some((id) => !allEventTypeIds.has(id))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  await Promise.all(
    input.ids.reverse().map((id, position) => {
      return prisma.eventType.update({
        where: {
          id,
        },
        data: {
          position,
        },
      });
    })
  );
};
