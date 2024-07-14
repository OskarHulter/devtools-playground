import checkSession from "../../_utils/auth";
import { checkInstalled } from "../../_utils/installation";
import { defaultResponder } from "@sln/lib/server";
import type { NextApiRequest } from "next";

export async function getHandler(req: NextApiRequest) {
  const session = checkSession(req);
  await checkInstalled("sendgrid", session.user?.id);
  return { url: "/apps/sendgrid/setup" };
}

export default defaultResponder(getHandler);
