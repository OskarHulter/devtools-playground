import type { UpdateAppCredentialsOptions } from "./updateAppCredentials.handler";
import { TRPCError } from "@trpc/server";

const validators = {
  paypal: () => import("@sln/paypal/lib/updateAppCredentials.validator"),
};

export const handleCustomValidations = async ({
  ctx,
  input,
  appId,
}: UpdateAppCredentialsOptions & { appId: string }) => {
  const { key } = input;
  const validatorGetter = validators[appId as keyof typeof validators];
  // If no validator is found, return the key as is
  if (!validatorGetter) return key;
  try {
    const validator = (await validatorGetter()).default;
    return await validator({ input, ctx });
  } catch (error) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
};
