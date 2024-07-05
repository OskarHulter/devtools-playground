import type { NextApiResponse } from "next";

import slnSignupHandler from "@sln/feature-auth/signup/handlers/slnHandler";
import selfHostedSignupHandler from "@sln/feature-auth/signup/handlers/selfHostedHandler";
import type { RequestWithUsernameStatus } from "@sln/features/auth/signup/username";
import { IS_PREMIUM_USERNAME_ENABLED } from "@sln/lib/constants";
import getIP from "@sln/lib/getIP";
import { HttpError } from "@sln/lib/http-error";
import logger from "@sln/lib/logger";
import { checkCfTurnstileToken } from "@sln/lib/server/checkCfTurnstileToken";
import { signupSchema } from "@sln/prisma/zod-utils";

function ensureSignupIsEnabled(req: RequestWithUsernameStatus) {
	const { token } = signupSchema
		.pick({
			token: true,
		})
		.parse(req.body);

	// Stil allow signups if there is a team invite
	if (token) return;

	if (process.env.NEXT_PUBLIC_DISABLE_SIGNUP === "true") {
		throw new HttpError({
			statusCode: 403,
			message: "Signup is disabled",
		});
	}
}

function ensureReqIsPost(req: RequestWithUsernameStatus) {
	if (req.method !== "POST") {
		throw new HttpError({
			statusCode: 405,
			message: "Method not allowed",
		});
	}
}

export default async function handler(
	req: RequestWithUsernameStatus,
	res: NextApiResponse,
) {
	const remoteIp = getIP(req);
	// Use a try catch instead of returning res every time
	try {
		await checkCfTurnstileToken({
			token: req.headers["cf-access-token"] as string,
			remoteIp,
		});

		ensureReqIsPost(req);
		ensureSignupIsEnabled(req);

		/**
			 * Im not sure its worth merging these two handlers. They are different enough to be separate.
			 * SLN handles things like creating a stripe customer - which we don't need to do for self hosted.
			 * It also handles things like premium username.
			 * TODO: (SEAN) - Extract a lot of the logic from slnHandler into a separate file and import it into both handlers.
			 * @zomars: We need to be able to test this with E2E. They way it's done RN it will never run on CI.
			 */
			return await slnSignupHandler(req, res);
		}

		return await selfHostedSignupHandler(req, res);
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.statusCode).json({ message: e.message });
		}
		logger.error(e);
		return res.status(500).json({ message: "Internal server error" });
	}
}
