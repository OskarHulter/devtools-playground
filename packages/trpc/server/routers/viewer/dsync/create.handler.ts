import type { TrpcSessionUser } from "../../../trpc";
import type { ZCreateInputSchema } from "./create.schema";
import type { DirectoryType } from "@boxyhq/saml-jackson";
import jackson from "@sln/features/ee/sso/lib/jackson";
import {
  canAccess,
  samlProductID,
  samlTenantID,
} from "@sln/features/ee/sso/lib/saml";
import prisma from "@sln/prisma";
import { TRPCError } from "@trpc/server";

type Options = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZCreateInputSchema;
};

// Create directory sync connection for a team
export const createHandler = async ({ ctx, input }: Options) => {
  const { organizationId } = input;
  const { dsyncController } = await jackson();

  const { message, access } = await canAccess(ctx.user, organizationId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  const { organization } = ctx.user;

  const tenant = input.organizationId
    ? `${organization.slug}-${organization.id}`
    : (samlTenantID as string);

  const { data, error } = await dsyncController.directories.create({
    tenant,
    product: samlProductID,
    name: input.name,
    type: input.provider as DirectoryType,
  });

  if (error || !data) {
    console.error("Error creating directory sync connection", error);
    throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
  }

  await prisma.dSyncData.create({
    data: {
      directoryId: data.id,
      tenant,
      ...(organizationId && { organizationId }),
    },
  });

  return data;
};

export default createHandler;
