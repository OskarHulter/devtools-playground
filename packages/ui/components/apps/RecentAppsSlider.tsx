import { AppCard } from "./AppCard";
import { Slider } from "./Slider";
import { useLocale } from "@sln/lib/hooks/useLocale";
import type { AppFrontendPayload as App } from "@sln/types/App";

export const RecentAppsSlider = <T extends App>({ items }: { items: T[] }) => {
  const { t } = useLocale();

  return (
    <Slider<T>
      title={t("recently_added")}
      items={items.sort(
        (a, b) =>
          new Date(b?.createdAt || 0).valueOf() -
          new Date(a?.createdAt || 0).valueOf()
      )}
      itemKey={(app) => app.name}
      options={{
        perView: 3,
        breakpoints: {
          768 /* and below */: {
            perView: 1,
          },
        },
      }}
      renderItem={(app) => <AppCard app={app} />}
    />
  );
};
