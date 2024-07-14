import type { TDeleteInviteInputSchema } from "./deleteInvite.schema";
import { isTeamAdmin } from "@sln/lib/server/queries/teams";
import { prisma } from "@sln/prisma";
import { TRPCError } from "@sln/trpc/server";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type DeleteInviteOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TDeleteInviteInputSchema;
};

export const deleteInviteHandler = async ({
  ctx,
  input,
}: DeleteInviteOptions) => {
  const { token } = input;

  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token: token,
    },
    select: {
      teamId: true,
      id: true,
    },
  });

  if (!verificationToken) throw new TRPCError({ code: "NOT_FOUND" });
  if (
    !verificationToken.teamId ||
    !(await isTeamAdmin(ctx.user.id, verificationToken.teamId))
  )
    throw new TRPCError({ code: "UNAUTHORIZED" });

  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });
};

export default deleteInviteHandler;
