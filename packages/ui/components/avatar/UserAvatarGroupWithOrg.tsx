import { useIsEmbed } from "@sln/embed-core/embed-iframe";
import { WEBAPP_URL } from "@sln/lib/constants";
import { getUserAvatarUrl } from "@sln/lib/getAvatarUrl";
import { getBookerBaseUrlSync } from "@sln/lib/getBookerUrl/client";
import type { Team, User } from "@sln/prisma/client";
import { AvatarGroup } from "@sln/ui";

type UserAvatarProps = Omit<
  React.ComponentProps<typeof AvatarGroup>,
  "items"
> & {
  users: (Pick<User, "name" | "username" | "avatarUrl"> & {
    bookerUrl: string;
  })[];
  organization: Pick<Team, "slug" | "name">;
};

export function UserAvatarGroupWithOrg(props: UserAvatarProps) {
  const { users, organization, ...rest } = props;
  const isEmbed = useIsEmbed();

  const items = [
    {
      // We don't want booker to be able to see the list of other users or teams inside the embed
      href: isEmbed ? null : getBookerBaseUrlSync(organization.slug),
      image: `${WEBAPP_URL}/team/${organization.slug}/avatar.png`,
      alt: organization.name || undefined,
      title: organization.name,
    },
  ].concat(
    users.map((user) => {
      return {
        href: `${user.bookerUrl}/${user.username}?redirect=false`,
        image: getUserAvatarUrl(user),
        alt: user.name || undefined,
        title: user.name || user.username || "",
      };
    })
  );
  return <AvatarGroup {...rest} items={items} />;
}
