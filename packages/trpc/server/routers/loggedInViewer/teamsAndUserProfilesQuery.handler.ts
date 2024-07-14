import type { TTeamsAndUserProfilesQueryInputSchema } from "./teamsAndUserProfilesQuery.schema";
import { getPlaceholderAvatar } from "@sln/lib/defaultAvatarImage";
import { withRoleCanCreateEntity } from "@sln/lib/entityPermissionUtils";
import { getUserAvatarUrl } from "@sln/lib/getAvatarUrl";
import type { PrismaClient } from "@sln/prisma";
import { teamMetadataSchema } from "@sln/prisma/zod-utils";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type TeamsAndUserProfileOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    prisma: PrismaClient;
  };
  input: TTeamsAndUserProfilesQueryInputSchema;
};

export const teamsAndUserProfilesQuery = async ({
  ctx,
  input,
}: TeamsAndUserProfileOptions) => {
  const { prisma } = ctx;

  const user = await prisma.user.findUnique({
    where: {
      id: ctx.user.id,
    },
    select: {
      avatarUrl: true,
      id: true,
      username: true,
      name: true,
      teams: {
        where: {
          accepted: true,
        },
        select: {
          role: true,
          team: {
            select: {
              id: true,
              isOrganization: true,
              logoUrl: true,
              name: true,
              slug: true,
              metadata: true,
              parentId: true,
              members: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  let teamsData;

  if (input?.includeOrg) {
    teamsData = user.teams.map((membership) => ({
      ...membership,
      team: {
        ...membership.team,
        metadata: teamMetadataSchema.parse(membership.team.metadata),
      },
    }));
  } else {
    teamsData = user.teams
      .filter((membership) => !membership.team.isOrganization)
      .map((membership) => ({
        ...membership,
        team: {
          ...membership.team,
          metadata: teamMetadataSchema.parse(membership.team.metadata),
        },
      }));
  }

  return [
    {
      teamId: null,
      name: user.name,
      slug: user.username,
      image: getUserAvatarUrl({
        avatarUrl: user.avatarUrl,
      }),
      readOnly: false,
    },
    ...teamsData.map((membership) => ({
      teamId: membership.team.id,
      name: membership.team.name,
      slug: membership.team.slug ? `team/${membership.team.slug}` : null,
      image: getPlaceholderAvatar(
        membership.team.logoUrl,
        membership.team.name
      ),
      role: membership.role,
      readOnly: !withRoleCanCreateEntity(membership.role),
    })),
  ];
};
