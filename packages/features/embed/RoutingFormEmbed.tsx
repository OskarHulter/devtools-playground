import { tabs } from "./lib/EmbedTabs";
import { useEmbedTypes } from "./lib/hooks";
import { EmbedDialog, EmbedButton } from "@sln/features/embed/Embed";
import type { ComponentProps } from "react";

export const RoutingFormEmbedDialog = () => {
  const types = useEmbedTypes();
  const routingFormTypes = types.filter((type) => type.type !== "email");
  return (
    <EmbedDialog
      types={routingFormTypes}
      tabs={tabs}
      eventTypeHideOptionDisabled={true}
    />
  );
};

export const RoutingFormEmbedButton = (
  props: ComponentProps<typeof EmbedButton>
) => {
  return <EmbedButton {...props} />;
};
