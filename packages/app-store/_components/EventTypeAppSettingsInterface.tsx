import type { EventTypeAppSettingsComponentProps } from "../types";
import { DynamicComponent } from "./DynamicComponent";
import { EventTypeSettingsMap } from "@sln/app-store/apps.browser.generated";

export const EventTypeAppSettings = (
  props: EventTypeAppSettingsComponentProps
) => {
  const { slug, ...rest } = props;
  return (
    <DynamicComponent
      slug={slug}
      componentMap={EventTypeSettingsMap}
      {...rest}
    />
  );
};
