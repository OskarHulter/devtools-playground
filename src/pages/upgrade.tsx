"use client";

import { useRouter } from "next/navigation";

import Shell from "@sln/features/shell/Shell";
import { useLocale } from "@sln/lib/hooks/useLocale";
import type { RouterOutputs } from "@sln/trpc/react";
import { trpc } from "@sln/trpc/react";
import { Button, EmptyScreen } from "@sln/ui";
import { showToast } from "@sln/ui";

import PageWrapper from "@components/PageWrapper";

export type OrgUpgradeBannerProps = {
	data: RouterOutputs["viewer"]["getUserTopBanners"]["orgUpgradeBanner"];
};

export default function UpgradePage() {
	const { t } = useLocale();

	const router = useRouter();
	const publishOrgMutation = trpc.viewer.organizations.publish.useMutation({
		onSuccess(data) {
			router.push(data.url);
		},
		onError: (error) => {
			showToast(error.message, "error");
		},
	});

	const doesUserHaveOrgToUpgrade =
		trpc.viewer.organizations.checkIfOrgNeedsUpgrade.useQuery();

	return (
		<Shell hideHeadingOnMobile>
			<div className="max-w-screen-lg">
				{doesUserHaveOrgToUpgrade.data ? (
					<EmptyScreen
						headline="Your upgrade is here"
						description="Improve your scheduling experience by upgrading to the new plan and enjoy the new features."
						Icon="circle-arrow-up"
						buttonRaw={
							<Button
								onClick={() => {
									publishOrgMutation.mutate();
								}}
							>
								{t("upgrade")}
							</Button>
						}
					/>
				) : (
					<EmptyScreen
						headline="You are all set"
						description="You are already on the latest plan. Nothing to upgrade. Enjoy the new features and reach out to us with any questions!"
						Icon="circle-check"
						buttonRaw={
							<Button href="mailto:support@stresslessness.org">
								{t("contact_support")}
							</Button>
						}
					/>
				)}
			</div>
		</Shell>
	);
}
UpgradePage.PageWrapper = PageWrapper;
