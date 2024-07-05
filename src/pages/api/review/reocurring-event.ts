import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import { handleNewRecurringBooking } from "@sln/features/bookings/lib/handleNewRecurringBooking";
import type { BookingResponse } from "@sln/features/bookings/types";
import { checkRateLimitAndThrowError } from "@sln/lib/checkRateLimitAndThrowError";
import getIP from "@sln/lib/getIP";
import { defaultResponder } from "@sln/lib/server";

// @TODO: Didn't look at the contents of this function in order to not break old booking page.

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

	const createdBookings: BookingResponse[] =
		await handleNewRecurringBooking(req);

	return createdBookings;
}

export const handleRecurringEventBooking = handler;

export default defaultResponder(handler);
