import { getAppFromSlug } from "@sln/app-store/utils";
import { type InvalidAppCredentialBannerProps } from "@sln/features/users/components/InvalidAppCredentialsBanner";
import { prisma } from "@sln/prisma";
import { MembershipRole } from "@sln/prisma/client";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type checkInvalidAppCredentialsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const checkInvalidAppCredentials = async ({
  ctx,
}: checkInvalidAppCredentialsOptions) => {
  const userId = ctx.user.id;

  const apps = await prisma.credential.findMany({
    where: {
      OR: [
        {
          userId: userId,
        },
        {
          team: {
            members: {
              some: {
                userId: userId,
                accepted: true,
                role: { in: [MembershipRole.ADMIN, MembershipRole.OWNER] },
              },
            },
          },
        },
      ],
      invalid: true,
    },
    select: {
      appId: true,
    },
  });

  const appNamesAndSlugs: InvalidAppCredentialBannerProps[] = [];
  for (const app of apps) {
    if (app.appId) {
      const appId = app.appId;
      const appMeta = await getAppFromSlug(appId);
      const name = appMeta ? appMeta.name : appId;
      appNamesAndSlugs.push({ slug: appId, name });
    }
  }

  return appNamesAndSlugs;
};
