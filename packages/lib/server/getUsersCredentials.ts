import { prisma } from "@sln/prisma";
import { credentialForCalendarServiceSelect } from "@sln/prisma/selects/credential";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type SessionUser = NonNullable<TrpcSessionUser>;
type User = { id: SessionUser["id"] };

export async function getUsersCredentials(user: User) {
  const credentials = await prisma.credential.findMany({
    where: {
      userId: user.id,
    },
    select: credentialForCalendarServiceSelect,
    orderBy: {
      id: "asc",
    },
  });
  return credentials;
}
