import type { appDataSchema } from "../zod";
import { useAppContextWithSchema } from "@sln/app-store/EventTypeAppContext";
import AppCard from "@sln/app-store/_components/AppCard";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { TextField } from "@sln/ui";
import { useState } from "react";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
}) {
  const { getAppData, setAppData } =
    useAppContextWithSchema<typeof appDataSchema>();
  const trackingId = getAppData("trackingId");
  const [enabled, setEnabled] = useState(getAppData("enabled"));

  return (
    <AppCard
      app={app}
      switchOnClick={(e) => {
        if (!e) {
          setEnabled(false);
        } else {
          setEnabled(true);
        }
      }}
      switchChecked={enabled}
      teamId={eventType.team?.id || undefined}
    >
      <TextField
        name="Tracking ID"
        value={trackingId}
        onChange={(e) => {
          setAppData("trackingId", e.target.value);
        }}
      />
    </AppCard>
  );
};

export default EventTypeAppCard;
