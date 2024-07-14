import type { TrpcSessionUser } from "../../../trpc";
import type { TSaveKeysInputSchema } from "./saveKeys.schema";
import type { Prisma } from "@prisma/client";
import { appKeysSchemas } from "@sln/app-store/apps.keys-schemas.generated";
import { getLocalAppMetadata } from "@sln/app-store/utils";
import type { PrismaClient } from "@sln/prisma";
import type { AppCategories } from "@sln/prisma/enums";
// import prisma from "@sln/prisma";
import { TRPCError } from "@trpc/server";

type SaveKeysOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    prisma: PrismaClient;
  };
  input: TSaveKeysInputSchema;
};

export const saveKeysHandler = async ({ ctx, input }: SaveKeysOptions) => {
  const keysSchema =
    appKeysSchemas[input.dirName as keyof typeof appKeysSchemas];
  const keys = keysSchema.parse(input.keys);

  // Get app name from metadata
  const localApps = getLocalAppMetadata();
  const appMetadata = localApps.find(
    (localApp) => localApp.slug === input.slug
  );

  if (!appMetadata?.dirName && appMetadata?.categories)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "App metadata could not be found",
    });

  await ctx.prisma.app.upsert({
    where: {
      slug: input.slug,
    },
    update: { keys, ...(input.fromEnabled && { enabled: true }) },
    create: {
      slug: input.slug,
      dirName: appMetadata?.dirName || appMetadata?.slug || "",
      categories:
        (appMetadata?.categories as AppCategories[]) ||
        ([appMetadata?.category] as AppCategories[]) ||
        undefined,
      keys: (input.keys as Prisma.InputJsonObject) || undefined,
      ...(input.fromEnabled && { enabled: true }),
    },
  });
};
