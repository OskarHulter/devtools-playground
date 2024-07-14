"use client";

import LicenseRequired from "@sln/features/ee/common/components/LicenseRequired";
import MakeTeamPrivateSwitch from "@sln/features/ee/teams/components/MakeTeamPrivateSwitch";
import { getLayout } from "@sln/features/settings/layouts/SettingsLayout";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { MembershipRole } from "@sln/prisma/enums";
import { trpc } from "@sln/trpc/react";
import { Meta } from "@sln/ui";

const PrivacyView = () => {
  const { t } = useLocale();
  const { data: currentOrg } = trpc.viewer.organizations.listCurrent.useQuery();
  const isOrgAdminOrOwner =
    currentOrg &&
    (currentOrg.user.role === MembershipRole.OWNER ||
      currentOrg.user.role === MembershipRole.ADMIN);
  const isInviteOpen = !currentOrg?.user.accepted;

  const isDisabled = isInviteOpen || !isOrgAdminOrOwner;

  if (!currentOrg) return null;

  return (
    <LicenseRequired>
      <Meta
        borderInShellHeader={false}
        title={t("privacy")}
        description={t("privacy_organization_description")}
      />
      <div>
        <MakeTeamPrivateSwitch
          isOrg={true}
          teamId={currentOrg.id}
          isPrivate={currentOrg.isPrivate}
          disabled={isDisabled}
        />
      </div>
    </LicenseRequired>
  );
};
PrivacyView.getLayout = getLayout;

export default PrivacyView;
