import type { THasEditPermissionForUserSchema } from "./hasEditPermissionForUser.schema";
import { hasEditPermissionForUserID as $hasEditPermissionForUser } from "@sln/lib/hasEditPermissionForUser";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type HasEditPermissionForUserOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: THasEditPermissionForUserSchema;
};

export const hasEditPermissionForUser = async ({
  ctx,
  input,
}: HasEditPermissionForUserOptions) => {
  // Calculate if the logged in User has edit permission for the given User.
  return $hasEditPermissionForUser({
    ctx,
    input,
  });
};

export default hasEditPermissionForUser;
