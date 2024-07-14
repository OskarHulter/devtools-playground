import type { TrpcSessionUser } from "../../../trpc";
import type { TAdminRemoveTwoFactor } from "./removeTwoFactor.schema";
import { prisma } from "@sln/prisma";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAdminRemoveTwoFactor;
};

const removeTwoFactorHandler = async ({ input }: GetOptions) => {
  const { userId } = input;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      backupCodes: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  return {
    success: true,
    userId,
  };
};

export default removeTwoFactorHandler;
