import { defaultHandler } from "@sln/lib/server";

export default defaultHandler({
  POST: import("./_postCheck"),
});
