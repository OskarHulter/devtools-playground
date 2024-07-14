import getAppKeysFromSlug from "@sln/app-store/_utils/getAppKeysFromSlug";
import { DailyLocationType } from "@sln/app-store/locations";
import getApps from "@sln/app-store/utils";
import { getUsersCredentials } from "@sln/lib/server/getUsersCredentials";
import { userMetadata as userMetadataSchema } from "@sln/prisma/zod-utils";
import type { EventTypeLocation } from "@sln/prisma/zod/custom/eventtype";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type SessionUser = NonNullable<TrpcSessionUser>;
type User = {
  id: SessionUser["id"];
  metadata: SessionUser["metadata"];
};

export async function getDefaultLocations(
  user: User
): Promise<EventTypeLocation[]> {
  const defaultConferencingData = userMetadataSchema.parse(
    user.metadata
  )?.defaultConferencingApp;

  if (
    defaultConferencingData &&
    defaultConferencingData.appSlug !== "daily-video"
  ) {
    const credentials = await getUsersCredentials(user);

    const foundApp = getApps(credentials, true).filter(
      (app) => app.slug === defaultConferencingData.appSlug
    )[0]; // There is only one possible install here so index [0] is the one we are looking for ;
    const locationType = foundApp?.locationOption?.value ?? DailyLocationType; // Default to Daily if no location type is found
    return [{ type: locationType, link: defaultConferencingData.appLink }];
  }

  const appKeys = await getAppKeysFromSlug("daily-video");

  if (typeof appKeys.api_key === "string") {
    return [{ type: DailyLocationType }];
  }

  return [];
}
