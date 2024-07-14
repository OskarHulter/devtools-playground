"use client";

import LicenseRequired from "@sln/features/ee/common/components/LicenseRequired";
import { getLayout } from "@sln/features/settings/layouts/SettingsLayout";
import { UserListTable } from "@sln/features/users/components/UserTable/UserListTable";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { MembershipRole } from "@sln/prisma/enums";
import { trpc } from "@sln/trpc/react";
import { Meta } from "@sln/ui";

const MembersView = () => {
  const { t } = useLocale();
  const { data: currentOrg, isPending } =
    trpc.viewer.organizations.listCurrent.useQuery();

  const isOrgAdminOrOwner =
    currentOrg &&
    (currentOrg.user.role === MembershipRole.OWNER ||
      currentOrg.user.role === MembershipRole.ADMIN);

  const canLoggedInUserSeeMembers =
    (currentOrg?.isPrivate && isOrgAdminOrOwner) ||
    isOrgAdminOrOwner ||
    !currentOrg?.isPrivate;

  return (
    <LicenseRequired>
      <Meta
        title={t("organization_members")}
        description={t("organization_description")}
      />
      <div>{!isPending && canLoggedInUserSeeMembers && <UserListTable />}</div>
      {!canLoggedInUserSeeMembers && (
        <div
          className="border-subtle rounded-xl border p-6"
          data-testId="members-privacy-warning"
        >
          <h2 className="text-default">
            {t("only_admin_can_see_members_of_org")}
          </h2>
        </div>
      )}
    </LicenseRequired>
  );
};
MembersView.getLayout = getLayout;

export default MembersView;
