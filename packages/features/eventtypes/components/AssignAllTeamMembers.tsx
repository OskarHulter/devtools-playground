import type { FormValues } from "@sln/features/eventtypes/lib/types";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { SettingsToggle } from "@sln/ui";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";

const AssignAllTeamMembers = ({
  assignAllTeamMembers,
  setAssignAllTeamMembers,
  onActive,
  onInactive,
}: {
  assignAllTeamMembers: boolean;
  setAssignAllTeamMembers: Dispatch<SetStateAction<boolean>>;
  onActive: () => void;
  onInactive?: () => void;
}) => {
  const { t } = useLocale();
  const { setValue } = useFormContext<FormValues>();

  return (
    <Controller<FormValues>
      name="assignAllTeamMembers"
      render={() => (
        <SettingsToggle
          title={t("automatically_add_all_team_members")}
          labelClassName="mt-0.5 font-normal"
          checked={assignAllTeamMembers}
          onCheckedChange={(active) => {
            setValue("assignAllTeamMembers", active, { shouldDirty: true });
            setAssignAllTeamMembers(active);
            if (active) {
              onActive();
            } else if (!!onInactive) {
              onInactive();
            }
          }}
        />
      )}
    />
  );
};

export default AssignAllTeamMembers;
