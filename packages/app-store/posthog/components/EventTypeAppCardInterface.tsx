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
  const trackingId = getAppData("TRACKING_ID");
  const apiHost = getAppData("API_HOST");
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
          required
          disabled={disabled}
          name="Tracking ID"
          value={trackingId}
          placeholder="Enter your Tracking ID"
          onChange={(e) => {
            setAppData("TRACKING_ID", e.target.value);
          }}
        />
        <TextField
          required
          disabled={disabled}
          name="Api host"
          value={apiHost}
          placeholder="Enter your Api host url"
          onChange={(e) => {
            setAppData("API_HOST", e.target.value);
          }}
        />
      </div>
    </AppCard>
  );
};

export default EventTypeAppCard;
