import { map } from "./procedures/map";
import publicProcedure from "@sln/trpc/server/procedures/publicProcedure";
import { router } from "@sln/trpc/server/trpc";

export const featureFlagRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    return prisma.feature.findMany({
      orderBy: { slug: "asc" },
      cacheStrategy: { swr: 300, ttl: 300 },
    });
  }),
  map,
});
