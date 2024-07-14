import type { TrpcSessionUser } from "../../../trpc";
import type { TAdminGet } from "./adminGet.schema";
import { prisma } from "@sln/prisma";
import { teamMetadataSchema } from "@sln/prisma/zod-utils";
import { TRPCError } from "@trpc/server";

type AdminGetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAdminGet;
};

export const adminGetHandler = async ({ input }: AdminGetOptions) => {
  const org = await prisma.team.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      metadata: true,
      isOrganization: true,
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
      organizationSettings: {
        select: {
          isOrganizationConfigured: true,
          isOrganizationVerified: true,
          orgAutoAcceptEmail: true,
        },
      },
    },
  });

  if (!org) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found",
    });
  }
  const parsedMetadata = teamMetadataSchema.parse(org.metadata);
  if (!org?.isOrganization) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found",
    });
  }
  return { ...org, metadata: parsedMetadata };
};

export default adminGetHandler;
