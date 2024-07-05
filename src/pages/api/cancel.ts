import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import handleCancelBooking from "@sln/features/bookings/lib/handleCancelBooking";
import { defaultResponder, defaultHandler } from "@sln/lib/server";

async function handler(
	req: NextApiRequest & { userId?: number },
	res: NextApiResponse,
) {
	const session = await getServerSession({ req, res });
	/* To mimic API behavior and comply with types */
	req.userId = session?.user?.id || -1;
	return await handleCancelBooking(req);
}

export default defaultHandler({
	DELETE: Promise.resolve({ default: defaultResponder(handler) }),
	POST: Promise.resolve({ default: defaultResponder(handler) }),
});
