import AppCard from "@sln/app-store/_components/AppCard";
import useIsAppEnabled from "@sln/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@sln/app-store/types";
import { WEBAPP_URL } from "@sln/lib/constants";
import { usePathname } from "next/navigation";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({
  app,
  eventType,
}) {
  const pathname = usePathname();

  const { enabled, updateEnabled } = useIsAppEnabled(app);

  return (
    <AppCard
      returnTo={`${WEBAPP_URL}${pathname}?tabName=apps`}
      app={app}
      teamId={eventType.team?.id || undefined}
      switchOnClick={(e) => {
        updateEnabled(e);
      }}
      switchChecked={enabled}
      hideAppCardOptions
    />
  );
};

export default EventTypeAppCard;
