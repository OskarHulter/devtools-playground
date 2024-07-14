import type { appDataSchema } from "../zod";
import { useAppContextWithSchema } from "@sln/app-store/EventTypeAppContext";
import AppCard from "@sln/app-store/_components/AppCard";
import useIsAppEnabled from "@sln/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { Icon } from "@sln/ui";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  eventType,
  app,
}) {
  const { getAppData, setAppData } =
    useAppContextWithSchema<typeof appDataSchema>();
  const isSunrise = getAppData("isSunrise");
  const { enabled, updateEnabled } = useIsAppEnabled(app);

  return (
    <AppCard
      app={app}
      switchOnClick={(e) => {
        if (!e) {
          updateEnabled(false);
          setAppData("isSunrise", false);
        } else {
          updateEnabled(true);
          setAppData("isSunrise", true);
        }
      }}
      switchChecked={enabled}
      teamId={eventType.team?.id || undefined}
    >
      <div className="mt-2 text-sm">
        <div className="flex">
          <span className="ltr:mr-2 rtl:ml-2">
            <Icon name={isSunrise ? "sunrise" : "sunset"} />
          </span>
          I am an AppCard for Event with Title: {eventType.title}
        </div>{" "}
        <div className="mt-2">
          Edit{" "}
          <span className="italic">
            packages/app-store/{app.slug}/EventTypeAppCardInterface.tsx
          </span>{" "}
          to play with me
        </div>
      </div>
    </AppCard>
  );
};

export default EventTypeAppCard;
