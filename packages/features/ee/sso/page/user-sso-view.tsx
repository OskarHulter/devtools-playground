"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import SSOConfiguration from "../components/SSOConfiguration";
import { HOSTED_CAL_FEATURES } from "@sln/lib/constants";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { Meta } from "@sln/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SAMLSSO = () => {
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (HOSTED_CAL_FEATURES) {
      router.push("/404");
    }
  }, []);

  return (
    <div className="bg-default w-full sm:mx-0">
      <Meta
        title={t("sso_configuration")}
        description={t("sso_configuration_description")}
        borderInShellHeader={true}
      />
      <SSOConfiguration teamId={null} />
    </div>
  );
};

SAMLSSO.getLayout = getLayout;

export default SAMLSSO;
