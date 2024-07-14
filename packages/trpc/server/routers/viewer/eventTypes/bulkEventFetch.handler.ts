import type { TrpcSessionUser } from "../../../trpc";
import getBulkEventTypes from "@sln/lib/event-types/getBulkEventTypes";

type BulkEventFetchOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const bulkEventFetchHandler = async ({ ctx }: BulkEventFetchOptions) => {
  return getBulkEventTypes(ctx.user.id);
};
