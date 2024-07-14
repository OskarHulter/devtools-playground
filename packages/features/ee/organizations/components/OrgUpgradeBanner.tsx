import { useIsPlatform } from "@sln/atoms/monorepo";
import { useLocale } from "@sln/lib/hooks/useLocale";
import type { RouterOutputs } from "@sln/trpc/react";
import { trpc } from "@sln/trpc/react";
import { showToast, TopBanner } from "@sln/ui";
import { useRouter } from "next/navigation";

export type OrgUpgradeBannerProps = {
  data: RouterOutputs["viewer"]["getUserTopBanners"]["orgUpgradeBanner"];
};

export function OrgUpgradeBanner({ data }: OrgUpgradeBannerProps) {
  const { t } = useLocale();
  const router = useRouter();
  const isPlatform = useIsPlatform();

  const publishOrgMutation = trpc.viewer.organizations.publish.useMutation({
    onSuccess(data) {
      router.push(data.url);
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  if (!data) return null;
  const [membership] = data;
  if (!membership) return null;

  // TODO: later figure out how to not show this banner on platform since platform is different to orgs (it just uses the same code)
  if (isPlatform) return null;

  return (
    <TopBanner
      text={t("org_upgrade_banner_description", {
        teamName: membership.team.name,
      })}
      variant="warning"
      actions={
        <button
          data-testid="upgrade_org_banner_button"
          className="border-b border-b-black"
          onClick={() => {
            publishOrgMutation.mutate();
          }}
        >
          {t("upgrade_banner_action")}
        </button>
      }
    />
  );
}
