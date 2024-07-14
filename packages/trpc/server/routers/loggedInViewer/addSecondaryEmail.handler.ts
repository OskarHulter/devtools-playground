import type { TAddSecondaryEmailInputSchema } from "./addSecondaryEmail.schema";
import { sendEmailVerification } from "@sln/features/auth/lib/verifyEmail";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import type { GetServerSidePropsContext, NextApiResponse } from "next";

type AddSecondaryEmailOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    res?: NextApiResponse | GetServerSidePropsContext["res"];
  };
  input: TAddSecondaryEmailInputSchema;
};

export const addSecondaryEmailHandler = async ({
  ctx,
  input,
}: AddSecondaryEmailOptions) => {
  const { user } = ctx;

  const existingPrimaryEmail = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingPrimaryEmail) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email already taken",
    });
  }

  const existingSecondaryEmail = await prisma.secondaryEmail.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingSecondaryEmail) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email already taken",
    });
  }

  const updatedData = await prisma.secondaryEmail.create({
    data: { ...input, userId: user.id },
  });

  await sendEmailVerification({
    email: updatedData.email,
    username: user?.username ?? undefined,
    language: user.locale,
    secondaryEmailId: updatedData.id,
  });

  return {
    data: updatedData,
    message: "Secondary email added successfully",
  };
};
