"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import SSOConfiguration from "../components/SSOConfiguration";
import { HOSTED_CAL_FEATURES } from "@sln/lib/constants";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { useParamsWithFallback } from "@sln/lib/hooks/useParamsWithFallback";
import { trpc } from "@sln/trpc/react";
import { AppSkeletonLoader as SkeletonLoader, Meta } from "@sln/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SAMLSSO = () => {
  const params = useParamsWithFallback();
  const { t } = useLocale();
  const router = useRouter();

  const teamId = Number(params.id);

  const {
    data: team,
    isPending,
    error,
  } = trpc.viewer.teams.get.useQuery({ teamId });

  useEffect(() => {
    if (!HOSTED_CAL_FEATURES) {
      router.push("/404");
    }
  }, []);

  useEffect(
    function refactorMeWithoutEffect() {
      if (error) {
        router.replace("/teams");
      }
    },
    [error]
  );
  if (isPending) {
    return <SkeletonLoader />;
  }

  if (!team) {
    router.push("/404");
    return;
  }

  return (
    <div className="bg-default w-full sm:mx-0 xl:mt-0">
      <Meta
        title={t("sso_configuration")}
        description={t("sso_configuration_description")}
      />
      <SSOConfiguration teamId={teamId} />
    </div>
  );
};

SAMLSSO.getLayout = getLayout;

export default SAMLSSO;
