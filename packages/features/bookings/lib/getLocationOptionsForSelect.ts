import type { LocationObject } from "@sln/app-store/locations";
import { locationKeyToString } from "@sln/app-store/locations";
import { getEventLocationType } from "@sln/app-store/locations";
import { getTranslatedLocation } from "@sln/app-store/locations";
import type { useLocale } from "@sln/lib/hooks/useLocale";
import notEmpty from "@sln/lib/notEmpty";

export default function getLocationsOptionsForSelect(
  locations: LocationObject[],
  t: ReturnType<typeof useLocale>["t"]
) {
  return locations
    .map((location) => {
      const eventLocation = getEventLocationType(location.type);
      const locationString = locationKeyToString(location);

      if (typeof locationString !== "string" || !eventLocation) {
        // It's possible that location app got uninstalled
        return null;
      }
      const type = eventLocation.type;
      const translatedLocation = getTranslatedLocation(
        location,
        eventLocation,
        t
      );

      return {
        // XYZ: is considered a namespace in i18next https://www.i18next.com/principles/namespaces and thus it get's cleaned up.
        label: translatedLocation || locationString,
        value: type,
        inputPlaceholder: t(eventLocation?.attendeeInputPlaceholder || ""),
      };
    })
    .filter(notEmpty);
}
