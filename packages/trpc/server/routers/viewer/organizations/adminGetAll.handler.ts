import type { TrpcSessionUser } from "../../../trpc";
import { prisma } from "@sln/prisma";
import { teamMetadataSchema } from "@sln/prisma/zod-utils";

type AdminGetAllOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const adminGetUnverifiedHandler = async ({}: AdminGetAllOptions) => {
  const allOrgs = await prisma.team.findMany({
    where: {
      isOrganization: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      metadata: true,
      organizationSettings: true,
      members: {
        where: {
          role: "OWNER",
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return allOrgs.map((org) => ({
    ...org,
    metadata: teamMetadataSchema.parse(org.metadata),
  }));
};

export default adminGetUnverifiedHandler;
