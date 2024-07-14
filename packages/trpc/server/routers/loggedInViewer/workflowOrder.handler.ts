import type { TWorkflowOrderInputSchema } from "./workflowOrder.schema";
import type { TFormSchema } from "@sln/app-store/routing-forms/trpc/forms.schema";
import { hasFilter } from "@sln/features/filters/lib/hasFilter";
import { prisma } from "@sln/prisma";
import { Prisma } from "@sln/prisma/client";
import { entries } from "@sln/prisma/zod-utils";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type RoutingFormOrderOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TWorkflowOrderInputSchema;
};

export const workflowOrderHandler = async ({
  ctx,
  input,
}: RoutingFormOrderOptions) => {
  const { user } = ctx;

  const { include: includedFields } =
    Prisma.validator<Prisma.WorkflowDefaultArgs>()({
      include: {
        activeOn: {
          select: {
            eventType: {
              select: {
                id: true,
                title: true,
                parentId: true,
                _count: {
                  select: {
                    children: true,
                  },
                },
              },
            },
          },
        },
        steps: true,
        team: {
          select: {
            id: true,
            slug: true,
            name: true,
            members: true,
            logoUrl: true,
          },
        },
      },
    });

  const allWorkflows = await prisma.workflow.findMany({
    where: {
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
    },
    include: includedFields,
    orderBy: [
      {
        position: "desc",
      },
      {
        id: "asc",
      },
    ],
  });

  const allWorkflowIds = new Set(allWorkflows.map((workflow) => workflow.id));
  if (input.ids.some((id) => !allWorkflowIds.has(id))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  await Promise.all(
    input.ids.reverse().map((id, position) => {
      return prisma.workflow.update({
        where: {
          id: id,
        },
        data: {
          position,
        },
      });
    })
  );
};

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
