import { getAppFromLocationValue } from "@sln/app-store/utils";
import { prisma } from "@sln/prisma";
import { eventTypeLocations as eventTypeLocationsSchema } from "@sln/prisma/zod-utils";

const getBulkEventTypes = async (userId: number) => {
  const eventTypes = await prisma.eventType.findMany({
    where: {
      userId,
      team: null,
    },
    select: {
      id: true,
      title: true,
      locations: true,
    },
  });

  const eventTypesWithLogo = eventTypes.map((eventType) => {
    const locationParsed = eventTypeLocationsSchema.safeParse(
      eventType.locations
    );

    // some events has null as location for legacy reasons, so this fallbacks to daily video
    const app = getAppFromLocationValue(
      locationParsed.success && locationParsed.data?.[0]?.type
        ? locationParsed.data[0].type
        : "integrations:daily"
    );
    return {
      ...eventType,
      logo: app?.logo,
    };
  });

  return {
    eventTypes: eventTypesWithLogo,
  };
};

export default getBulkEventTypes;
