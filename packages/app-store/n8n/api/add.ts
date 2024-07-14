import { createDefaultInstallation } from "../../_utils/installation";
import appConfig from "../config.json";
import type { AppDeclarativeHandler } from "@sln/types/AppHandler";

const handler: AppDeclarativeHandler = {
  appType: appConfig.type,
  variant: appConfig.variant,
  slug: appConfig.slug,
  supportsMultipleInstalls: false,
  handlerType: "add",
  redirect: {
    url: "https://n8n.io/integrations/cal-trigger/",
    newTab: true,
  },
  createCredential: ({ appType, user, slug, teamId }) =>
    createDefaultInstallation({ appType, user: user, slug, key: {}, teamId }),
};

export default handler;
