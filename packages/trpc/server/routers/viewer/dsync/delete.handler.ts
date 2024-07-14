import type { TrpcSessionUser } from "../../../trpc";
import type { ZDeleteInputSchema } from "./delete.schema";
import jackson from "@sln/features/ee/sso/lib/jackson";
import { canAccess } from "@sln/features/ee/sso/lib/saml";
import prisma from "@sln/prisma";
import { TRPCError } from "@trpc/server";

type Options = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZDeleteInputSchema;
};

// Delete directory sync connection for a team
export const deleteHandler = async ({ ctx, input }: Options) => {
  const { dsyncController } = await jackson();

  const { message, access } = await canAccess(ctx.user, input.organizationId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  await prisma.dSyncData.deleteMany({
    where: {
      organizationId: input.organizationId || undefined,
    },
  });
  await dsyncController.directories.delete(input.directoryId);

  return null;
};

export default deleteHandler;
