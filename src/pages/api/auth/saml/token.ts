import type { NextApiRequest } from "next";

import jackson from "@sln/features/ee/sso/lib/jackson";
import { defaultHandler, defaultResponder } from "@sln/lib/server";

async function postHandler(req: NextApiRequest) {
	const { oauthController } = await jackson();
	return await oauthController.token(req.body);
}

export default defaultHandler({
	POST: Promise.resolve({ default: defaultResponder(postHandler) }),
});
