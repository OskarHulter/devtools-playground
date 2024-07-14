import { getSession } from "./getSession";
import { HttpError } from "@sln/lib/http-error";
import type { NextApiRequest } from "next";

type CtxOrReq =
  | { req: NextApiRequest; ctx?: never }
  | { ctx: { req: NextApiRequest }; req?: never };

export const ensureSession = async (ctxOrReq: CtxOrReq) => {
  const session = await getSession(ctxOrReq);
  if (!session?.user.id)
    throw new HttpError({ statusCode: 401, message: "Unauthorized" });
  return session;
};
