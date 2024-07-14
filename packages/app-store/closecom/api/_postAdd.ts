import checkSession from "../../_utils/auth";
import getInstalledAppPath from "../../_utils/getInstalledAppPath";
import appConfig from "../config.json";
import { symmetricEncrypt } from "@sln/lib/crypto";
import { HttpError } from "@sln/lib/http-error";
import logger from "@sln/lib/logger";
import { defaultResponder } from "@sln/lib/server";
import prisma from "@sln/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = checkSession(req);

  const { api_key } = req.body;
  if (!api_key)
    throw new HttpError({
      statusCode: 400,
      message: "No Api Key provoided to check",
    });

  const encrypted = symmetricEncrypt(
    JSON.stringify({ api_key }),
    process.env.CALENDSO_ENCRYPTION_KEY || ""
  );

  const data = {
    type: appConfig.type,
    key: { encrypted },
    userId: session.user?.id,
    appId: appConfig.slug,
  };

  try {
    await prisma.credential.create({
      data,
      select: {
        id: true,
      },
    });
  } catch (reason) {
    logger.error("Could not add Close.com app", reason);
    return res.status(500).json({ message: "Could not add Close.com app" });
  }

  return res.status(200).json({
    url: req.query.returnTo
      ? req.query.returnTo
      : getInstalledAppPath({ variant: "crm", slug: "closecom" }),
  });
}

export default defaultResponder(getHandler);
