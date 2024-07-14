import type { TrpcSessionUser } from "../../../trpc";
import type { TEditInputSchema } from "./edit.schema";
import prisma from "@sln/prisma";

type EditOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TEditInputSchema;
};

export const editHandler = async ({ ctx, input }: EditOptions) => {
  const { id, ...data } = input;

  const {
    apiKeys: [updatedApiKey],
  } = await prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      apiKeys: {
        update: {
          where: {
            id,
          },
          data,
        },
      },
    },
    select: {
      apiKeys: {
        where: {
          id,
        },
      },
    },
  });

  return updatedApiKey;
};
