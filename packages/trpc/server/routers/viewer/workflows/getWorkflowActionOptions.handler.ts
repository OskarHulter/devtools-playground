import { hasTeamPlanHandler } from "../teams/hasTeamPlan.handler";
import { getWorkflowActionOptions } from "@sln/features/ee/workflows/lib/getOptions";
import { IS_SELF_HOSTED } from "@sln/lib/constants";
import hasKeyInMetadata from "@sln/lib/hasKeyInMetadata";
import { getTranslation } from "@sln/lib/server/i18n";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type GetWorkflowActionOptionsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser> & {
      locale: string;
    };
  };
};

export const getWorkflowActionOptionsHandler = async ({
  ctx,
}: GetWorkflowActionOptionsOptions) => {
  const { user } = ctx;

  const isCurrentUsernamePremium =
    user && hasKeyInMetadata(user, "isPremium")
      ? !!user.metadata.isPremium
      : false;

  let isTeamsPlan = false;
  if (!isCurrentUsernamePremium) {
    const { hasTeamPlan } = await hasTeamPlanHandler({ ctx });
    isTeamsPlan = !!hasTeamPlan;
  }

  const hasOrgsPlan = !!user.profile?.organizationId;

  const t = await getTranslation(ctx.user.locale, "common");
  return getWorkflowActionOptions(
    t,
    IS_SELF_HOSTED || isCurrentUsernamePremium || isTeamsPlan,
    IS_SELF_HOSTED || hasOrgsPlan
  );
};
