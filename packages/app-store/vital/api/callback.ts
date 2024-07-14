import getInstalledAppPath from "../../_utils/getInstalledAppPath";
import type { Prisma } from "@prisma/client";
import prisma from "@sln/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This is will generate a user token for a client_user_id`
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userWithMetadata = await prisma.user.findFirst({
      where: {
        id: req?.session?.user.id,
      },
      select: {
        id: true,
        metadata: true,
      },
    });

    await prisma.user.update({
      where: {
        id: req?.session?.user.id,
      },
      data: {
        metadata: {
          ...(userWithMetadata?.metadata as Prisma.JsonObject),
          vitalSettings: {
            ...((userWithMetadata?.metadata as Prisma.JsonObject)
              ?.vitalSettings as Prisma.JsonObject),
            connected: true,
          },
        },
      },
    });
    return res.redirect(
      getInstalledAppPath({ variant: "other", slug: "vital-automation" })
    );
  } catch (e) {
    return res.status(500);
  }
}
