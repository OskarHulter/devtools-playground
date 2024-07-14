import { getUserAvatarUrl } from "@sln/lib/getAvatarUrl";
import { getBookerBaseUrlSync } from "@sln/lib/getBookerUrl/client";
import type { User } from "@sln/prisma/client";
import type { UserProfile } from "@sln/types/UserProfile";
import { AvatarGroup } from "@sln/ui";

type UserAvatarProps = Omit<
  React.ComponentProps<typeof AvatarGroup>,
  "items"
> & {
  users: (Pick<User, "name" | "username" | "avatarUrl"> & {
    profile: Omit<UserProfile, "upId">;
  })[];
};
export function UserAvatarGroup(props: UserAvatarProps) {
  const { users, ...rest } = props;

  return (
    <AvatarGroup
      {...rest}
      items={users.map((user) => ({
        href: `${getBookerBaseUrlSync(
          user.profile?.organization?.slug ?? null
        )}/${user.profile?.username}?redirect=false`,
        alt: user.name || "",
        title: user.name || "",
        image: getUserAvatarUrl(user),
      }))}
    />
  );
}
