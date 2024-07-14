import type { TrpcSessionUser } from "../../../trpc";
import type { TUserInputSchema } from "./user.schema";
import { getUserAvailability } from "@sln/core/getUserAvailability";

type UserOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUserInputSchema;
};

export const userHandler = async ({ input }: UserOptions) => {
  return getUserAvailability(
    { returnDateOverrides: true, ...input },
    undefined
  );
};
