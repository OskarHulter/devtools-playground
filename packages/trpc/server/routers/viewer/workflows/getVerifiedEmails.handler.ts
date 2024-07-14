import type { TGetVerifiedEmailsInputSchema } from "./getVerifiedEmails.schema";
import type { VerifiedEmail } from "@prisma/client";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";
import { TRPCError } from "@trpc/server";

type GetVerifiedEmailsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetVerifiedEmailsInputSchema;
};

export const getVerifiedEmailsHandler = async ({
  ctx,
  input,
}: GetVerifiedEmailsOptions) => {
  const { user } = ctx;
  const { teamId } = input;
  let verifiedEmails: VerifiedEmail[] = [];

  if (teamId) {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
      },
      select: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
    }

    const isTeamMember = team.members.some(
      (member) => member.userId === user.id
    );

    if (!isTeamMember) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team",
      });
    }

    verifiedEmails = team.members.map((member) => ({
      email: member.user.email,
      userId: user.id,
      teamId,
      id: member.user.id,
    }));
  }

  const emails = await prisma.verifiedEmail.findMany({
    where: {
      OR: [{ userId: user.id }, { teamId: input.teamId }],
    },
  });

  verifiedEmails = verifiedEmails.concat(emails);

  return verifiedEmails;
};
