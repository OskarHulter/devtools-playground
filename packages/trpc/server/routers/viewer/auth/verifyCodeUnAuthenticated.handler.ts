import { totpRawCheck } from "@sln/lib/totp";
import type { ZVerifyCodeInputSchema } from "@sln/prisma/zod-utils";
import { TRPCError } from "@trpc/server";
import { createHash } from "crypto";

type VerifyTokenOptions = {
  input: ZVerifyCodeInputSchema;
};

export const verifyCodeUnAuthenticatedHandler = async ({
  input,
}: VerifyTokenOptions) => {
  const { email, code } = input;

  if (!email || !code) throw new TRPCError({ code: "BAD_REQUEST" });

  const secret = createHash("md5")
    .update(email + process.env.CALENDSO_ENCRYPTION_KEY)
    .digest("hex");

  const isValidToken = totpRawCheck(code, secret, { step: 900 });

  if (!isValidToken)
    throw new TRPCError({ code: "BAD_REQUEST", message: "invalid_code" });

  return isValidToken;
};
