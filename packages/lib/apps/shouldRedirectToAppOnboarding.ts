import type { AppMeta } from "@sln/types/App";

export const shouldRedirectToAppOnboarding = (appMetadata: AppMeta) => {
  const hasEventTypes = appMetadata?.extendsFeature == "EventType";
  return hasEventTypes;
};
