import getAppKeysFromSlug from "../../_utils/getAppKeysFromSlug";
import appConfig from "../config.json";
import { createDefaultInstallation } from "@sln/app-store/_utils/installation";
import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import { HttpError } from "@sln/lib/http-error";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const appKeys = await getAppKeysFromSlug(appConfig.slug);
  let client_id = "";
  if (typeof appKeys.client_id === "string") client_id = appKeys.client_id;
  if (!client_id)
    return res.status(400).json({ message: "pipedrive client id missing." });
  // Check that user is authenticated
  req.session = await getServerSession({ req, res });
  const { teamId } = req.query;
  const user = req.session?.user;
  if (!user) {
    throw new HttpError({
      statusCode: 401,
      message: "You must be logged in to do this",
    });
  }
  const userId = user.id;
  await createDefaultInstallation({
    appType: `${appConfig.slug}_other_calendar`,
    user,
    slug: appConfig.slug,
    key: {},
    teamId: Number(teamId),
  });

  const tenantId = teamId ? teamId : userId;
  res.status(200).json({
    url: `https://oauth.pipedrive.com/oauth/authorize?client_id=${appKeys.client_id}&redirect_uri=https://app.revert.dev/oauth-callback/pipedrive&state={%22tenantId%22:%22${tenantId}%22,%22revertPublicToken%22:%22${process.env.REVERT_PUBLIC_TOKEN}%22}`,
    newTab: true,
  });
}
