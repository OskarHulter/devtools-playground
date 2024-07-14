import { Tooltip } from "../tooltip";
import { Badge } from "./Badge";
import { useLocale } from "@sln/lib/hooks/useLocale";

export const UpgradeOrgsBadge = function UpgradeOrgsBadge() {
  const { t } = useLocale();

  return (
    <Tooltip content={t("orgs_upgrade_to_enable_feature")}>
      <a href="https://oskarhulter.com/enterprise" target="_blank">
        <Badge variant="gray">{t("upgrade")}</Badge>
      </a>
    </Tooltip>
  );
};
