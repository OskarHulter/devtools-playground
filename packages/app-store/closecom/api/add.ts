import { defaultHandler } from "@sln/lib/server";

export default defaultHandler({
  GET: import("./_getAdd"),
  POST: import("./_postAdd"),
});
