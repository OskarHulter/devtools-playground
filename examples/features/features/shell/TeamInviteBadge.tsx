import { useTeamInvites } from "@sln/lib/hooks/useHasPaidPlan";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { Badge } from "@sln/ui";

export function TeamInviteBadge() {
  const { isPending, listInvites } = useTeamInvites();
  const { t } = useLocale();

  if (isPending || !listInvites || listInvites.length === 0) return null;

  return <Badge variant="default">{t("invite_team_notifcation_badge")}</Badge>;
}
