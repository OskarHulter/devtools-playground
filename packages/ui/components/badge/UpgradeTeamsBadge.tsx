import { Tooltip } from "../tooltip";
import { Badge } from "./Badge";
import { useHasPaidPlan } from "@sln/lib/hooks/useHasPaidPlan";
import { useLocale } from "@sln/lib/hooks/useLocale";
import Link from "next/link";

export const UpgradeTeamsBadge = function UpgradeTeamsBadge() {
  const { t } = useLocale();
  const { hasPaidPlan } = useHasPaidPlan();

  if (hasPaidPlan) return null;

  return (
    <Tooltip content={t("upgrade_to_enable_feature")}>
      <Link href="/teams">
        <Badge variant="gray">{t("upgrade")}</Badge>
      </Link>
    </Tooltip>
  );
};
