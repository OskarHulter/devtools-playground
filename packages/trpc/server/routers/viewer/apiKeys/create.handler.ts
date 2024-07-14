import type { TrpcSessionUser } from "../../../trpc";
import { checkPermissions } from "./_auth-middleware";
import type { TCreateInputSchema } from "./create.schema";
import { generateUniqueAPIKey } from "@sln/ee/api-keys/lib/apiKeys";
import prisma from "@sln/prisma";
import { MembershipRole } from "@sln/prisma/enums";
import { v4 } from "uuid";

type CreateHandlerOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateInputSchema;
};

export const createHandler = async ({ ctx, input }: CreateHandlerOptions) => {
  const [hashedApiKey, apiKey] = generateUniqueAPIKey();

  // Here we snap never expires before deleting it so it's not passed to prisma create call.
  const { neverExpires, teamId, ...rest } = input;
  const userId = ctx.user.id;

  /** Only admin or owner can create apiKeys of team (if teamId is passed) */
  await checkPermissions({
    userId,
    teamId,
    role: { in: [MembershipRole.OWNER, MembershipRole.ADMIN] },
  });

  await prisma.apiKey.create({
    data: {
      id: v4(),
      userId: ctx.user.id,
      teamId,
      ...rest,
      // And here we pass a null to expiresAt if never expires is true. otherwise just pass expiresAt from input
      expiresAt: neverExpires ? null : rest.expiresAt,
      hashedKey: hashedApiKey,
    },
  });

  const apiKeyPrefix = process.env.API_KEY_PREFIX ?? "cal_";

  const prefixedApiKey = `${apiKeyPrefix}${apiKey}`;

  return prefixedApiKey;
};
