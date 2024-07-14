import { defaultHandler } from "@sln/lib/server";

export default defaultHandler({
  GET: import("./_getCallback"),
});
