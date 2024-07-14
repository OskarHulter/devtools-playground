import type { TrpcSessionUser } from "../../../trpc";
import type { TUpdateInputSchema } from "./update.schema";
import jackson from "@sln/features/ee/sso/lib/jackson";
import {
  canAccess,
  samlProductID,
  samlTenantID,
  tenantPrefix,
} from "@sln/features/ee/sso/lib/saml";
import { TRPCError } from "@trpc/server";

type UpdateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateInputSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  const { connectionController } = await jackson();

  const { encodedRawMetadata, teamId } = input;

  const { message, access } = await canAccess(ctx.user, teamId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  try {
    return await connectionController.createSAMLConnection({
      encodedRawMetadata,
      defaultRedirectUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/auth/saml-idp`,
      redirectUrl: JSON.stringify([`${process.env.NEXT_PUBLIC_WEBAPP_URL}/*`]),
      tenant: teamId ? tenantPrefix + teamId : samlTenantID,
      product: samlProductID,
    });
  } catch (err) {
    console.error("Error updating SAML connection", err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Updating SAML Connection failed.",
    });
  }
};