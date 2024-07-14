import { hasTeamPlanHandler } from "../teams/hasTeamPlan.handler";
import type { TSendVerificationCodeInputSchema } from "./sendVerificationCode.schema";
import { sendVerificationCode } from "@sln/features/ee/workflows/lib/reminders/verifyPhoneNumber";
import hasKeyInMetadata from "@sln/lib/hasKeyInMetadata";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type SendVerificationCodeOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TSendVerificationCodeInputSchema;
};

export const sendVerificationCodeHandler = async ({
  ctx,
  input,
}: SendVerificationCodeOptions) => {
  const { user } = ctx;

  const isCurrentUsernamePremium =
    user && hasKeyInMetadata(user, "isPremium")
      ? !!user.metadata.isPremium
      : false;

  let isTeamsPlan = false;
  if (!isCurrentUsernamePremium) {
    const { hasTeamPlan } = await hasTeamPlanHandler({ ctx });
    isTeamsPlan = !!hasTeamPlan;
  }

  if (!isCurrentUsernamePremium && !isTeamsPlan) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { phoneNumber } = input;
  return sendVerificationCode(phoneNumber);
};
