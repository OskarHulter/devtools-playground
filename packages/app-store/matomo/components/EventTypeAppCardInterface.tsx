import type { appDataSchema } from "../zod";
import { useAppContextWithSchema } from "@sln/app-store/EventTypeAppContext";
import AppCard from "@sln/app-store/_components/AppCard";
import useIsAppEnabled from "@sln/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { TextField } from "@sln/ui";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
}) {
  const { getAppData, setAppData, disabled } =
    useAppContextWithSchema<typeof appDataSchema>();
  const matomoUrl = getAppData("MATOMO_URL");
  const siteId = getAppData("SITE_ID");
  const { enabled, updateEnabled } = useIsAppEnabled(app);

  return (
    <AppCard
      hideSettingsIcon
      app={app}
      switchOnClick={(e) => {
        updateEnabled(e);
      }}
      switchChecked={enabled}
      teamId={eventType.team?.id || undefined}
    >
      <div className="flex flex-col gap-2">
        <TextField
          dataTestid={`${app.slug}-url`}
          name="Matomo URL"
          placeholder="Enter your Matomo URL here"
          value={matomoUrl}
          disabled={disabled}
          onChange={(e) => {
            setAppData("MATOMO_URL", e.target.value);
          }}
        />
        <TextField
          dataTestid={`${app.slug}-site-id`}
          disabled={disabled}
          name="Site ID"
          placeholder="Enter your Site ID"
          value={siteId}
          onChange={(e) => {
            setAppData("SITE_ID", e.target.value);
          }}
        />
      </div>
    </AppCard>
  );
};

export default EventTypeAppCard;
