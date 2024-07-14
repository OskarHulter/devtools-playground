import { checkRateLimitAndThrowError } from "@sln/lib/checkRateLimitAndThrowError";
import { IS_PRODUCTION } from "@sln/lib/constants";
import logger from "@sln/lib/logger";
import { totpRawCheck } from "@sln/lib/totp";
import type { ZVerifyCodeInputSchema } from "@sln/prisma/zod-utils";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { createHash } from "crypto";

type VerifyCodeOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZVerifyCodeInputSchema;
};

export const verifyCodeHandler = async ({ ctx, input }: VerifyCodeOptions) => {
  const { email, code } = input;
  const { user } = ctx;

  if (!user || !email || !code) throw new TRPCError({ code: "BAD_REQUEST" });

  if (!IS_PRODUCTION || process.env.NEXT_PUBLIC_IS_E2E) {
    logger.warn(`Skipping code verification in dev/E2E environment`);
    return true;
  }

  if (user.role === "ADMIN") {
    logger.warn(`Skipping code verification for instance admin`);
    return true;
  }

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: email,
  });

  const secret = createHash("md5")
    .update(email + process.env.CALENDSO_ENCRYPTION_KEY)
    .digest("hex");

  const isValidToken = totpRawCheck(code, secret, { step: 900 });

  if (!isValidToken)
    throw new TRPCError({ code: "BAD_REQUEST", message: "invalid_code" });

  return isValidToken;
};

export default verifyCodeHandler;
