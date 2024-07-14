import type { TDeleteMeInputSchema } from "./deleteMe.schema";
import { ErrorCode } from "@sln/features/auth/lib/ErrorCode";
import { verifyPassword } from "@sln/features/auth/lib/verifyPassword";
import { deleteUser } from "@sln/features/users/lib/userDeletionService";
import { symmetricDecrypt } from "@sln/lib/crypto";
import { HttpError } from "@sln/lib/http-error";
import { totpAuthenticatorCheck } from "@sln/lib/totp";
import { prisma } from "@sln/prisma";
import { IdentityProvider } from "@sln/prisma/enums";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type DeleteMeOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TDeleteMeInputSchema;
};

export const deleteMeHandler = async ({ ctx, input }: DeleteMeOptions) => {
  // TODO: First check password is part of input and meets requirements.

  // Check if input.password is correct
  const user = await prisma.user.findUnique({
    where: {
      email: ctx.user.email.toLowerCase(),
    },
    select: {
      identityProvider: true,
      twoFactorEnabled: true,
      twoFactorSecret: true,
      password: true,
      email: true,
      metadata: true,
      id: true,
    },
  });
  if (!user) {
    throw new HttpError({ statusCode: 404, message: ErrorCode.UserNotFound });
  }

  if (user.identityProvider !== IdentityProvider.CAL) {
    throw new HttpError({
      statusCode: 400,
      message: ErrorCode.ThirdPartyIdentityProviderEnabled,
    });
  }

  if (!user.password?.hash) {
    throw new HttpError({
      statusCode: 400,
      message: ErrorCode.UserMissingPassword,
    });
  }

  const isCorrectPassword = await verifyPassword(
    input.password,
    user.password.hash
  );
  if (!isCorrectPassword) {
    throw new HttpError({
      statusCode: 403,
      message: ErrorCode.IncorrectPassword,
    });
  }

  if (user.twoFactorEnabled) {
    if (!input.totpCode) {
      throw new HttpError({
        statusCode: 400,
        message: ErrorCode.SecondFactorRequired,
      });
    }

    if (!user.twoFactorSecret) {
      console.error(
        `Two factor is enabled for user ${user.id} but they have no secret`
      );
      throw new Error(ErrorCode.InternalServerError);
    }

    if (!process.env.CALENDSO_ENCRYPTION_KEY) {
      console.error(
        `"Missing encryption key; cannot proceed with two factor login."`
      );
      throw new Error(ErrorCode.InternalServerError);
    }

    const secret = symmetricDecrypt(
      user.twoFactorSecret,
      process.env.CALENDSO_ENCRYPTION_KEY
    );
    if (secret.length !== 32) {
      console.error(
        `Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`
      );
      throw new Error(ErrorCode.InternalServerError);
    }

    // If user has 2fa enabled, check if input.totpCode is correct
    const isValidToken = totpAuthenticatorCheck(input.totpCode, secret);
    if (!isValidToken) {
      throw new HttpError({
        statusCode: 403,
        message: ErrorCode.IncorrectTwoFactorCode,
      });
    }
  }

  await deleteUser(user);
  return;
};
