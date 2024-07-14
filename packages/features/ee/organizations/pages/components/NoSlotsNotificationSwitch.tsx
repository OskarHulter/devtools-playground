import { useLocale } from "@sln/lib/hooks/useLocale";
import type { RouterOutputs } from "@sln/trpc";
import { trpc } from "@sln/trpc";
import { SettingsToggle, showToast } from "@sln/ui";
import { useState } from "react";

interface GeneralViewProps {
  currentOrg: RouterOutputs["viewer"]["organizations"]["listCurrent"];
  isAdminOrOwner: boolean;
}

export const NoSlotsNotificationSwitch = ({
  currentOrg,
  isAdminOrOwner,
}: GeneralViewProps) => {
  const { t } = useLocale();
  const utils = trpc.useUtils();
  const [notificationActive, setNotificationActive] = useState(
    !!currentOrg.organizationSettings.adminGetsNoSlotsNotification
  );

  const mutation = trpc.viewer.organizations.update.useMutation({
    onSuccess: async () => {
      showToast(t("settings_updated_successfully"), "success");
    },
    onError: () => {
      showToast(t("error_updating_settings"), "error");
    },
    onSettled: () => {
      utils.viewer.organizations.listCurrent.invalidate();
    },
  });

  if (!isAdminOrOwner) return null;

  return (
    <>
      <SettingsToggle
        toggleSwitchAtTheEnd={true}
        title={t("organization_no_slots_notification_switch_title")}
        disabled={mutation?.isPending}
        description={t("organization_no_slots_notification_switch_description")}
        checked={notificationActive}
        onCheckedChange={(checked) => {
          mutation.mutate({
            adminGetsNoSlotsNotification: checked,
          });
          setNotificationActive(checked);
        }}
        switchContainerClassName="mt-6"
      />
    </>
  );
};
