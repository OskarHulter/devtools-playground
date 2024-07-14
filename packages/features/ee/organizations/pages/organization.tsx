import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import { getFeatureFlag } from "@sln/features/flags/server/utils";
import { MembershipRole } from "@sln/prisma/client";
import type { GetServerSidePropsContext } from "next";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const prisma = await import("@sln/prisma").then((mod) => mod.default);
  const organizationsEnabled = await getFeatureFlag(prisma, "organizations");
  // Check if organizations are enabled
  if (!organizationsEnabled) {
    return {
      notFound: true,
    };
  }

  // Check if logged in user has an organization assigned
  const session = await getServerSession({ req, res });

  if (!session?.user.profile?.organizationId) {
    return {
      notFound: true,
    };
  }

  // Check if logged in user has OWNER/ADMIN role in organization
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session?.user.id,
      teamId: session?.user.profile.organizationId,
    },
    select: {
      role: true,
    },
  });
  if (!membership?.role || membership?.role === MembershipRole.MEMBER) {
    return {
      notFound: true,
    };
  }

  // Otherwise, all good
  return {
    props: {},
  };
};
