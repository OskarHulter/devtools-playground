import { getSerializableForm } from "../lib/getSerializableForm";
import type { TFormQueryInputSchema } from "./formQuery.schema";
import { entityPrismaWhereClause } from "@sln/lib/entityPermissionUtils";
import type { PrismaClient } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

interface FormsHandlerOptions {
  ctx: {
    prisma: PrismaClient;
    user: NonNullable<TrpcSessionUser>;
  };
  input: TFormQueryInputSchema;
}

export const formQueryHandler = async ({ ctx, input }: FormsHandlerOptions) => {
  const { prisma, user } = ctx;
  const form = await prisma.app_RoutingForms_Form.findFirst({
    where: {
      AND: [
        entityPrismaWhereClause({ userId: user.id }),
        {
          id: input.id,
        },
      ],
    },
    include: {
      team: { select: { slug: true, name: true } },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  if (!form) {
    return null;
  }

  return await getSerializableForm({ form });
};

export default formQueryHandler;
