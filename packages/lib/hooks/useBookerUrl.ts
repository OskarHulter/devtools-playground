import { useOrgBranding } from "@sln/features/ee/organizations/context/provider";
import { WEBAPP_URL, WEBSITE_URL } from "@sln/lib/constants";

export const useBookerUrl = () => {
  const orgBranding = useOrgBranding();
  return orgBranding?.fullDomain ?? WEBSITE_URL ?? WEBAPP_URL;
};
