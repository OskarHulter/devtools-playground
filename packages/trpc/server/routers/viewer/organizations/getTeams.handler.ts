import type { TrpcSessionUser } from "../../../trpc";
import { prisma } from "@sln/prisma";
import { TRPCError } from "@trpc/server";

type GetTeamsHandler = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export async function getTeamsHandler({ ctx }: GetTeamsHandler) {
  const currentUser = ctx.user;

  if (!currentUser.organizationId)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  const allOrgTeams = await prisma.team.findMany({
    where: {
      parentId: currentUser.organizationId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return allOrgTeams;
}

export default getTeamsHandler;
