import type { TrpcSessionUser } from "../../../trpc";
import { passwordResetRequest } from "@sln/features/auth/lib/passwordResetRequest";
import prisma from "@sln/prisma";
import { IdentityProvider } from "@sln/prisma/enums";
import { TRPCError } from "@trpc/server";

type CreateAccountPasswordOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const createAccountPasswordHandler = async ({
  ctx,
}: CreateAccountPasswordOptions) => {
  const { user } = ctx;

  const isCal = user.identityProvider === IdentityProvider.CAL;
  if (isCal) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "cannot_create_account_password_cal_provider",
    });
  }

  const userWithPassword = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      password: true,
    },
  });
  if (!isCal && userWithPassword?.password?.hash) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "cannot_create_account_password_already_existing",
    });
  }

  await passwordResetRequest(user);
};
