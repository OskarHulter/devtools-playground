import appConfig from "../config.json";
import { createDefaultInstallation } from "@sln/app-store/_utils/installation";
import type { AppDeclarativeHandler } from "@sln/types/AppHandler";


const handler: AppDeclarativeHandler = {
  appType: appConfig.type,
  variant: appConfig.variant,
  slug: appConfig.slug,
  supportsMultipleInstalls: false,
  handlerType: "add",
  redirect: {
    newTab: true,
    url: "https://go.oskarhulter.com/deel",
  },
  createCredential: ({ appType, user, slug, teamId }) =>
    createDefaultInstallation({ appType, user: user, slug, key: {}, teamId }),
};

export default handler;
