import type { appDataSchema } from "../zod";
import EventTypeAppSettingsInterface from "./EventTypeAppSettingsInterface";
import { useAppContextWithSchema } from "@sln/app-store/EventTypeAppContext";
import AppCard from "@sln/app-store/_components/AppCard";
import useIsAppEnabled from "@sln/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { useLocale } from "@sln/lib/hooks/useLocale";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
}) {
  const { getAppData, setAppData, disabled } =
    useAppContextWithSchema<typeof appDataSchema>();
  const { enabled: showGifSelection, updateEnabled: setShowGifSelection } =
    useIsAppEnabled(app);

  const { t } = useLocale();

  return (
    <AppCard
      app={app}
      description={t("confirmation_page_gif")}
      switchOnClick={(e) => {
        setShowGifSelection(e);
      }}
      switchChecked={showGifSelection}
      teamId={eventType.team?.id || undefined}
    >
      <EventTypeAppSettingsInterface
        eventType={eventType}
        slug={app.slug}
        disabled={disabled}
        getAppData={getAppData}
        setAppData={setAppData}
      />
    </AppCard>
  );
};

export default EventTypeAppCard;
