import type { TGetMembershipbyUserInputSchema } from "./getMembershipbyUser.schema";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type GetMembershipbyUserOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetMembershipbyUserInputSchema;
};

export const getMembershipbyUserHandler = async ({
  ctx,
  input,
}: GetMembershipbyUserOptions) => {
  if (ctx.user.id !== input.memberId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You cannot view memberships that are not your own.",
    });
  }

  return await prisma.membership.findUnique({
    where: {
      userId_teamId: {
        userId: input.memberId,
        teamId: input.teamId,
      },
    },
  });
};

export default getMembershipbyUserHandler;
