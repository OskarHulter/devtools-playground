import { getFeatureFlagMap } from "../utils";
import publicProcedure from "@sln/trpc/server/procedures/publicProcedure";

export const map = publicProcedure.query(async ({ ctx }) => {
  const { prisma } = ctx;
  return getFeatureFlagMap(prisma);
});
