import { getSerializableForm } from "../lib/getSerializableForm";
import type { TFormSchema } from "./forms.schema";
import { hasFilter } from "@sln/features/filters/lib/hasFilter";
import {
  entityPrismaWhereClause,
  canEditEntity,
} from "@sln/lib/entityPermissionUtils";
import logger from "@sln/lib/logger";
import type { PrismaClient } from "@sln/prisma";
import type { Prisma } from "@sln/prisma/client";
import { entries } from "@sln/prisma/zod-utils";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

interface FormsHandlerOptions {
  ctx: {
    prisma: PrismaClient;
    user: NonNullable<TrpcSessionUser>;
  };
  input: TFormSchema;
}
const log = logger.getSubLogger({ prefix: ["[formsHandler]"] });

export const formsHandler = async ({ ctx, input }: FormsHandlerOptions) => {
  const { prisma, user } = ctx;

  const where = getPrismaWhereFromFilters(user, input?.filters);
  log.debug("Getting forms where", JSON.stringify(where));

  const forms = await prisma.app_RoutingForms_Form.findMany({
    where,
    orderBy: [
      {
        position: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      team: {
        include: {
          members: true,
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  const totalForms = await prisma.app_RoutingForms_Form.count({
    where: entityPrismaWhereClause({
      userId: user.id,
    }),
  });

  const serializableForms = [];
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    const hasWriteAccess = canEditEntity(form, user.id);
    serializableForms.push({
      form: await getSerializableForm({ form: forms[i] }),
      readOnly: !hasWriteAccess,
    });
  }

  return {
    filtered: serializableForms,
    totalCount: totalForms,
  };
};

export default formsHandler;
type SupportedFilters =
  | Omit<NonNullable<NonNullable<TFormSchema>["filters"]>, "upIds">
  | undefined;

export function getPrismaWhereFromFilters(
  user: {
    id: number;
  },
  filters: SupportedFilters
) {
  const where = {
    OR: [] as Prisma.App_RoutingForms_FormWhereInput[],
  };

  const prismaQueries: Record<
    keyof NonNullable<typeof filters>,
    (...args: [number[]]) => Prisma.App_RoutingForms_FormWhereInput
  > & {
    all: () => Prisma.App_RoutingForms_FormWhereInput;
  } = {
    userIds: (userIds: number[]) => ({
      userId: {
        in: userIds,
      },
      teamId: null,
    }),
    teamIds: (teamIds: number[]) => ({
      team: {
        id: {
          in: teamIds ?? [],
        },
        members: {
          some: {
            userId: user.id,
            accepted: true,
          },
        },
      },
    }),
    all: () => ({
      OR: [
        {
          userId: user.id,
        },
        {
          team: {
            members: {
              some: {
                userId: user.id,
                accepted: true,
              },
            },
          },
        },
      ],
    }),
  };

  if (!filters || !hasFilter(filters)) {
    where.OR.push(prismaQueries.all());
  } else {
    for (const entry of entries(filters)) {
      if (!entry) {
        continue;
      }
      const [filterName, filter] = entry;
      const getPrismaQuery = prismaQueries[filterName];
      // filter might be accidentally set undefined as well
      if (!getPrismaQuery || !filter) {
        continue;
      }
      where.OR.push(getPrismaQuery(filter));
    }
  }

  return where;
}
