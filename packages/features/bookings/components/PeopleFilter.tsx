import { useFilterQuery } from "@sln/features/bookings/lib/useFilterQuery";
import { useOrgBranding } from "@sln/features/ee/organizations/context/provider";
import {
  FilterCheckboxField,
  FilterCheckboxFieldsContainer,
} from "@sln/features/filters/components/TeamsFilter";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { trpc } from "@sln/trpc/react";
import {
  AnimatedPopover,
  Avatar,
  Divider,
  FilterSearchField,
  Icon,
} from "@sln/ui";
import { useState } from "react";

export const PeopleFilter = () => {
  const { t } = useLocale();
  const orgBranding = useOrgBranding();

  const { data: currentOrg } = trpc.viewer.organizations.listCurrent.useQuery();
  const isAdmin =
    currentOrg?.user.role === "ADMIN" || currentOrg?.user.role === "OWNER";
  const hasPermToView = !currentOrg?.isPrivate || isAdmin;

  const {
    data: query,
    pushItemToKey,
    removeItemByKeyAndValue,
    removeAllQueryParams,
  } = useFilterQuery();
  const [searchText, setSearchText] = useState("");

  const members = trpc.viewer.teams.listMembers.useQuery({});

  const filteredMembers = members?.data
    ?.filter((member) => member.accepted)
    ?.filter((member) =>
      searchText.trim() !== ""
        ? member?.name?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          member?.username?.toLowerCase()?.includes(searchText.toLowerCase())
        : true
    );

  const getTextForPopover = () => {
    const userIds = query.userIds;
    if (userIds) {
      return `${t("number_selected", { count: userIds.length })}`;
    }
    return `${t("all")}`;
  };

  if (!hasPermToView) {
    return null;
  }

  return (
    <AnimatedPopover text={getTextForPopover()} prefix={`${t("people")}: `}>
      <FilterCheckboxFieldsContainer>
        <FilterCheckboxField
          id="all"
          icon={<Icon name="user" className="h-4 w-4" />}
          checked={!query.userIds?.length}
          onChange={removeAllQueryParams}
          label={t("all_users_filter_label")}
        />
        <Divider />
        <FilterSearchField
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={t("search")}
        />
        {filteredMembers?.map((member) => (
          <FilterCheckboxField
            key={member.id}
            id={member.id.toString()}
            label={member?.name ?? member.username ?? t("no_name")}
            checked={!!query.userIds?.includes(member.id)}
            onChange={(e) => {
              if (e.target.checked) {
                pushItemToKey("userIds", member.id);
              } else if (!e.target.checked) {
                removeItemByKeyAndValue("userIds", member.id);
              }
            }}
            icon={
              <Avatar
                alt={`${member?.id} avatar`}
                imageSrc={member.avatarUrl}
                size="xs"
              />
            }
          />
        ))}
        {filteredMembers?.length === 0 && (
          <h2 className="text-default px-4 py-2 text-sm font-medium">
            {t("no_options_available")}
          </h2>
        )}
      </FilterCheckboxFieldsContainer>
    </AnimatedPopover>
  );
};
