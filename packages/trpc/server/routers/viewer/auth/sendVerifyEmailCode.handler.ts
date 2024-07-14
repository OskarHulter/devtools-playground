import type { TRPCContext } from "../../../createContext";
import type { TSendVerifyEmailCodeSchema } from "./sendVerifyEmailCode.schema";
import { sendEmailVerificationByCode } from "@sln/features/auth/lib/verifyEmail";
import { checkRateLimitAndThrowError } from "@sln/lib/checkRateLimitAndThrowError";
import getIP from "@sln/lib/getIP";
import type { NextApiRequest } from "next";

type SendVerifyEmailCode = {
  input: TSendVerifyEmailCodeSchema;
  req: TRPCContext["req"] | undefined;
};

export const sendVerifyEmailCodeHandler = async ({
  input,
  req,
}: SendVerifyEmailCode) => {
  const identifer = req ? getIP(req as NextApiRequest) : input.email;

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: `emailVerifyByCode.${identifer}`,
  });

  const email = await sendEmailVerificationByCode({
    email: input.email,
    username: input.username,
    language: input.language,
    isVerifyingEmail: input.isVerifyingEmail,
  });

  return email;
};
