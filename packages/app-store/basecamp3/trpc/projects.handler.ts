import getAppKeysFromSlug from "../../_utils/getAppKeysFromSlug";
import type { BasecampToken } from "../lib/CalendarService";
import { refreshAccessToken } from "../lib/helpers";
import type { PrismaClient } from "@sln/prisma/client";
import { credentialForCalendarServiceSelect } from "@sln/prisma/selects/credential";
import { TRPCError } from "@sln/trpc/server";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

interface ProjectsHandlerOptions {
  ctx: {
    prisma: PrismaClient;
    user: NonNullable<TrpcSessionUser>;
  };
}

export const projectHandler = async ({ ctx }: ProjectsHandlerOptions) => {
  const { user_agent } = await getAppKeysFromSlug("basecamp3");
  const { user, prisma } = ctx;
  const credential = await prisma.credential.findFirst({
    where: {
      userId: user?.id,
    },
    select: credentialForCalendarServiceSelect,
  });
  if (!credential) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No credential found for user",
    });
  }
  let credentialKey = credential.key as BasecampToken;
  if (!credentialKey.account) {
    return;
  }

  if (credentialKey.expires_at < Date.now()) {
    credentialKey = (await refreshAccessToken(credential)) as BasecampToken;
  }

  const url = `${credentialKey.account.href}/projects.json`;

  const resp = await fetch(url, {
    headers: {
      "User-Agent": user_agent as string,
      Authorization: `Bearer ${credentialKey.access_token}`,
    },
  });
  const projects = await resp.json();
  return { currentProject: credentialKey.projectId, projects };
};