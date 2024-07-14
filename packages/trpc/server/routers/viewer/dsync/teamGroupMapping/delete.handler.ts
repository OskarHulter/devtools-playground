import type { ZDeleteInputSchema } from "./delete.schema";
import userCanCreateTeamGroupMapping from "@sln/features/ee/dsync/lib/server/userCanCreateTeamGroupMapping";
import prisma from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type Options = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZDeleteInputSchema;
};

// Delete directory sync connection for a team
export const deleteHandler = async ({ ctx, input }: Options) => {
  await userCanCreateTeamGroupMapping(
    ctx.user,
    ctx.user.organizationId,
    input.teamId
  );

  await prisma.dSyncTeamGroupMapping.delete({
    where: {
      teamId_groupName: {
        teamId: input.teamId,
        groupName: input.groupName,
      },
    },
  });

  return { deletedGroupName: input.groupName };
};

export default deleteHandler;
