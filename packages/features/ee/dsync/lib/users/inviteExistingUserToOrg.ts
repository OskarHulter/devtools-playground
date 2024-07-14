import { createAProfileForAnExistingUser } from "@sln/lib/createAProfileForAnExistingUser";
import prisma from "@sln/prisma";
import type { UserWithMembership } from "@sln/trpc/server/routers/viewer/teams/inviteMember/utils";
import type { TFunction } from "next-i18next";

/**
 * This should only be used in a dsync context
 */
const inviteExistingUserToOrg = async ({
  user,
  org,
  translation,
}: {
  user: UserWithMembership;
  org: { id: number; name: string; parent: { name: string } | null };
  translation: TFunction;
}) => {
  await createAProfileForAnExistingUser({
    user: {
      id: user.id,
      email: user.email,
      currentUsername: user.username,
    },
    organizationId: org.id,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      organizationId: org.id,
      teams: {
        create: {
          teamId: org.id,
          role: "MEMBER",
          // Since coming from directory assume it'll be verified
          accepted: true,
        },
      },
    },
  });

  return user;
};

export default inviteExistingUserToOrg;
