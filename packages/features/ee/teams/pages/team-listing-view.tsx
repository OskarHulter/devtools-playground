"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import { TeamsListing } from "../components";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { Meta } from "@sln/ui";

const TeamListingView = () => {
  const { t } = useLocale();
  return (
    <>
      <Meta
        title={t("teams")}
        description={t("create_manage_teams_collaborative")}
      />
      <TeamsListing />
    </>
  );
};

TeamListingView.getLayout = getLayout;

export default TeamListingView;
