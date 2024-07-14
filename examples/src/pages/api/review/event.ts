import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import handleNewBooking from "@sln/features/bookings/lib/handleNewBooking";
import { checkRateLimitAndThrowError } from "@sln/lib/checkRateLimitAndThrowError";
import getIP from "@sln/lib/getIP";
import { defaultResponder } from "@sln/lib/server";

async function handler(
	req: NextApiRequest & { userId?: number },
	res: NextApiResponse,
) {
	const userIp = getIP(req);

	await checkRateLimitAndThrowError({
		rateLimitingType: "core",
		identifier: userIp,
	});

	const session = await getServerSession({ req, res });
	/* To mimic API behavior and comply with types */
	req.userId = session?.user?.id || -1;
	const booking = await handleNewBooking(req);
	return booking;
}

export default defaultResponder(handler);
