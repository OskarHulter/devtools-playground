import type { TrpcSessionUser } from "../../../trpc";
import type { TDeleteInputSchema } from "./delete.schema";
import jackson from "@sln/features/ee/sso/lib/jackson";
import {
  canAccess,
  samlProductID,
  samlTenantID,
  tenantPrefix,
} from "@sln/features/ee/sso/lib/saml";
import { TRPCError } from "@trpc/server";

type DeleteOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TDeleteInputSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const { connectionController } = await jackson();

  const { teamId } = input;

  const { message, access } = await canAccess(ctx.user, teamId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  try {
    return await connectionController.deleteConnections({
      tenant: teamId ? tenantPrefix + teamId : samlTenantID,
      product: samlProductID,
    });
  } catch (err) {
    console.error("Error deleting SAML connection", err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Deleting SAML Connection failed.",
    });
  }
};