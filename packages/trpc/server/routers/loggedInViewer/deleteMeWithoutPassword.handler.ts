import { deleteStripeCustomer } from "@sln/app-store/stripepayment/lib/customer";
import { ErrorCode } from "@sln/features/auth/lib/ErrorCode";
import { deleteWebUser as syncServicesDeleteWebUser } from "@sln/lib/sync/SyncServiceManager";
import { prisma } from "@sln/prisma";
import { IdentityProvider } from "@sln/prisma/enums";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type DeleteMeWithoutPasswordOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const deleteMeWithoutPasswordHandler = async ({
  ctx,
}: DeleteMeWithoutPasswordOptions) => {
  const user = await prisma.user.findUnique({
    where: {
      email: ctx.user.email.toLowerCase(),
    },
  });
  if (!user) {
    throw new Error(ErrorCode.UserNotFound);
  }

  if (user.identityProvider === IdentityProvider.CAL) {
    throw new Error(ErrorCode.SocialIdentityProviderRequired);
  }

  if (user.twoFactorEnabled) {
    throw new Error(ErrorCode.SocialIdentityProviderRequired);
  }

  // Remove me from Stripe
  await deleteStripeCustomer(user).catch(console.warn);

  // Remove my account
  const deletedUser = await prisma.user.delete({
    where: {
      id: ctx.user.id,
    },
  });
  // Sync Services
  syncServicesDeleteWebUser(deletedUser);

  return;
};
