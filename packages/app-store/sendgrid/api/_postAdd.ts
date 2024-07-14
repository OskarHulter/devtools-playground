import checkSession from "../../_utils/auth";
import getInstalledAppPath from "../../_utils/getInstalledAppPath";
import { symmetricEncrypt } from "@sln/lib/crypto";
import { HttpError } from "@sln/lib/http-error";
import logger from "@sln/lib/logger";
import { defaultResponder } from "@sln/lib/server";
import prisma from "@sln/prisma";
import type { NextApiRequest } from "next";

export async function getHandler(req: NextApiRequest) {
  const session = checkSession(req);

  const { api_key } = req.body;
  if (!api_key)
    throw new HttpError({
      statusCode: 400,
      message: "No Api Key provided to check",
    });

  let encrypted;
  try {
    encrypted = symmetricEncrypt(
      JSON.stringify({ api_key }),
      process.env.CALENDSO_ENCRYPTION_KEY || ""
    );
  } catch (reason) {
    logger.error("Could not add Sendgrid app", reason);
    throw new HttpError({
      statusCode: 500,
      message: "Invalid length - CALENDSO_ENCRYPTION_KEY",
    });
  }

  const data = {
    type: "sendgrid_other_calendar",
    key: { encrypted },
    userId: session.user?.id,
    appId: "sendgrid",
  };

  try {
    await prisma.credential.create({
      data,
    });
  } catch (reason) {
    logger.error("Could not add Sendgrid app", reason);
    throw new HttpError({
      statusCode: 500,
      message: "Could not add Sendgrid app",
    });
  }

  return { url: getInstalledAppPath({ variant: "other", slug: "sendgrid" }) };
}

export default defaultResponder(getHandler);
