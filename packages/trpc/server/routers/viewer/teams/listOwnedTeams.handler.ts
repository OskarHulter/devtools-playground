import type { TrpcSessionUser } from "../../../trpc";
import { prisma } from "@sln/prisma";
import { MembershipRole } from "@sln/prisma/enums";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const listOwnedTeamsHandler = async ({ ctx }: ListOptions) => {
  const user = await prisma.user.findFirst({
    where: {
      id: ctx.user.id,
    },
    select: {
      id: true,
      teams: {
        where: {
          accepted: true,
          role: {
            in: [MembershipRole.OWNER, MembershipRole.ADMIN],
          },
        },
        select: {
          team: true,
        },
      },
    },
  });

  return user?.teams
    ?.filter((m) => {
      return !m.team.isOrganization;
    })
    ?.map(({ team }) => team);
};
