import type { EventTypeAppCardComponentProps, CredentialOwner } from "../types";
import { DynamicComponent } from "./DynamicComponent";
import type {
  GetAppData,
  SetAppData,
} from "@sln/app-store/EventTypeAppContext";
import EventTypeAppContext from "@sln/app-store/EventTypeAppContext";
import { EventTypeAddonMap } from "@sln/app-store/apps.browser.generated";
import type { EventTypeMetaDataSchema } from "@sln/prisma/zod-utils";
import type { RouterOutputs } from "@sln/trpc/react";
import { ErrorBoundary } from "@sln/ui";
import type z from "zod";

export const EventTypeAppCard = (props: {
  app: RouterOutputs["viewer"]["integrations"]["items"][number] & {
    credentialOwner?: CredentialOwner;
  };
  eventType: EventTypeAppCardComponentProps["eventType"];
  getAppData: GetAppData;
  setAppData: SetAppData;
  // For event type apps, get these props from shouldLockDisableProps
  LockedIcon?: JSX.Element | false;
  eventTypeFormMetadata: z.infer<typeof EventTypeMetaDataSchema>;
  disabled?: boolean;
}) => {
  const { app, getAppData, setAppData, LockedIcon, disabled } = props;
  return (
    <ErrorBoundary message={`There is some problem with ${app.name} App`}>
      <EventTypeAppContext.Provider
        value={{ getAppData, setAppData, LockedIcon, disabled }}
      >
        <DynamicComponent
          slug={app.slug === "stripe" ? "stripepayment" : app.slug}
          componentMap={EventTypeAddonMap}
          {...props}
        />
      </EventTypeAppContext.Provider>
    </ErrorBoundary>
  );
};
