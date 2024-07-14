import type { appDataSchema } from "../zod";
import { useAppContextWithSchema } from "@sln/app-store/EventTypeAppContext";
import AppCard from "@sln/app-store/_components/AppCard";
import useIsAppEnabled from "@sln/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { WEBAPP_URL } from "@sln/lib/constants";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { SchedulingType } from "@sln/prisma/enums";
import { Switch, Alert } from "@sln/ui";
import { usePathname } from "next/navigation";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
}) {
  const pathname = usePathname();

  const { getAppData, setAppData, disabled } =
    useAppContextWithSchema<typeof appDataSchema>();
  const { enabled, updateEnabled } = useIsAppEnabled(app);
  const isRoundRobinLeadSkipEnabled = getAppData("roundRobinLeadSkip");
  const { t } = useLocale();

  return (
    <AppCard
      returnTo={`${WEBAPP_URL}${pathname}?tabName=apps`}
      app={app}
      teamId={eventType.team?.id || undefined}
      switchOnClick={(e) => {
        updateEnabled(e);
      }}
      switchChecked={enabled}
      hideSettingsIcon
    >
      <>
        {eventType.schedulingType === SchedulingType.ROUND_ROBIN ? (
          <div>
            <Switch
              label={t("skip_rr_assignment_label")}
              labelOnLeading
              checked={isRoundRobinLeadSkipEnabled}
              onCheckedChange={(checked) => {
                setAppData("roundRobinLeadSkip", checked);
                if (checked) {
                  // temporary solution, enabled should always be already set
                  setAppData("enabled", checked);
                }
              }}
            />
            <Alert
              className="mt-2"
              severity="neutral"
              title={t("skip_rr_description")}
            />
          </div>
        ) : null}
      </>
    </AppCard>
  );
};

export default EventTypeAppCard;
