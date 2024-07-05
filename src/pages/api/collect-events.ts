import { collectApiHandler } from "next-collect/server";

import { extendEventData, nextCollectBasicSettings } from "@sln/lib/telemetry";

export default collectApiHandler({
	...nextCollectBasicSettings,
	cookieName: "__clnds",
	extend: extendEventData,
});
