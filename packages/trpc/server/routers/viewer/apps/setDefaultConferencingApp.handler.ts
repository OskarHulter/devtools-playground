import type { TrpcSessionUser } from "../../../trpc";
import type { TSetDefaultConferencingAppSchema } from "./setDefaultConferencingApp.schema";
import setDefaultConferencingApp from "@sln/app-store/_utils/setDefaultConferencingApp";

type SetDefaultConferencingAppOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TSetDefaultConferencingAppSchema;
};

export const setDefaultConferencingAppHandler = async ({
  ctx,
  input,
}: SetDefaultConferencingAppOptions) => {
  return await setDefaultConferencingApp(ctx.user.id, input.slug);
};
