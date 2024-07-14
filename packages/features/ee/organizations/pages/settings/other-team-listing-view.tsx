"use client";

import { getLayout } from "../../../../settings/layouts/SettingsLayout";
import { OtherTeamsListing } from "./../components/OtherTeamsListing";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { Meta } from "@sln/ui";

const OtherTeamListingView = (): React.ReactElement => {
  const { t } = useLocale();
  return (
    <>
      <Meta
        title={t("org_admin_other_teams")}
        description={t("org_admin_other_teams_description")}
      />
      <OtherTeamsListing />
    </>
  );
};

OtherTeamListingView.getLayout = getLayout;

export default OtherTeamListingView;
