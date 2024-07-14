import type { TGetCalVideoRecordingsInputSchema } from "./getCalVideoRecordings.schema";
import { getRecordingsOfCalVideoByRoomName } from "@sln/core/videoClient";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type GetCalVideoRecordingsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetCalVideoRecordingsInputSchema;
};

export const getCalVideoRecordingsHandler = async ({
  ctx: _ctx,
  input,
}: GetCalVideoRecordingsOptions) => {
  const { roomName } = input;

  try {
    const res = await getRecordingsOfCalVideoByRoomName(roomName);
    return res;
  } catch (err) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
};
