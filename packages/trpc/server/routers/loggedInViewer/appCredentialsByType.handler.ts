import type { TAppCredentialsByTypeInputSchema } from "./appCredentialsByType.schema";
import { UserRepository } from "@sln/lib/server/repository/user";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type AppCredentialsByTypeOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAppCredentialsByTypeInputSchema;
};

/** Used for grabbing credentials on specific app pages */
export const appCredentialsByTypeHandler = async ({
  ctx,
  input,
}: AppCredentialsByTypeOptions) => {
  const { user } = ctx;
  const userAdminTeams = await UserRepository.getUserAdminTeams(ctx.user.id);

  const credentials = await prisma.credential.findMany({
    where: {
      OR: [
        { userId: user.id },
        {
          teamId: {
            in: userAdminTeams,
          },
        },
      ],
      type: input.appType,
    },
  });

  // For app pages need to return which teams the user can install the app on
  // return user.credentials.filter((app) => app.type == input.appType).map((credential) => credential.id);
  return {
    credentials,
    userAdminTeams,
  };
};
