import checkSession from "../../_utils/auth";
import getInstalledAppPath from "../../_utils/getInstalledAppPath";
import {
  checkInstalled,
  createDefaultInstallation,
} from "../../_utils/installation";
import appConfig from "../config.json";
import { defaultResponder } from "@sln/lib/server";
import type { NextApiRequest } from "next";

export async function getHandler(req: NextApiRequest) {
  const session = checkSession(req);
  const slug = appConfig.slug;
  const appType = appConfig.type;
  const returnTo = req.query?.returnTo;

  await checkInstalled(slug, session.user.id);
  await createDefaultInstallation({
    appType,
    user: session.user,
    slug,
    key: {},
  });

  return {
    url:
      returnTo ??
      getInstalledAppPath({ variant: appConfig.variant, slug: "ping" }),
  };
}

export default defaultResponder(getHandler);