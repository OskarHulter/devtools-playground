import OtherTeamList from "./OtherTeamList";
import SkeletonLoaderTeamList from "@sln/ee/teams/components/SkeletonloaderTeamList";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { trpc } from "@sln/trpc/react";
import { Alert, EmptyScreen } from "@sln/ui";

export function OtherTeamsListing() {
  const { t } = useLocale();

  const {
    data: teams,
    isPending,
    error,
  } = trpc.viewer.organizations.listOtherTeams.useQuery();

  if (isPending) {
    return <SkeletonLoaderTeamList />;
  }

  return (
    <>
      {!!error && <Alert severity="error" title={error.message} />}

      {teams && teams.length > 0 ? (
        <OtherTeamList teams={teams} />
      ) : (
        <EmptyScreen
          headline={t("no_other_teams_found")}
          title={t("no_other_teams_found")}
          description={t("no_other_teams_found_description")}
        />
      )}
    </>
  );
}
