import type { TLocationOptionsInputSchema } from "./locationOptions.schema";
import { getLocationGroupedOptions } from "@sln/app-store/server";
import { getTranslation } from "@sln/lib/server/i18n";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type LocationOptionsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TLocationOptionsInputSchema;
};

export const locationOptionsHandler = async ({
  ctx,
  input,
}: LocationOptionsOptions) => {
  const { teamId } = input;

  const t = await getTranslation(ctx.user.locale ?? "en", "common");

  const locationOptions = await getLocationGroupedOptions(
    teamId ? { teamId } : { userId: ctx.user.id },
    t
  );
  // If it is a team event then move the "use host location" option to top
  if (input.teamId) {
    const conferencingIndex = locationOptions.findIndex(
      (option) => option.label === "Conferencing"
    );
    if (conferencingIndex !== -1) {
      const conferencingObject = locationOptions.splice(
        conferencingIndex,
        1
      )[0];
      locationOptions.unshift(conferencingObject);
    }
  }

  return locationOptions;
};