import { z } from "zod";

import { AVATAR_FALLBACK, CAL_URL } from "@sln/lib/constants";
import type { User } from "@sln/prisma/client";

/**
 * Gives an organization aware avatar url for a user
 * It ensures that the wrong avatar isn't fetched by ensuring that organizationId is always passed
 * It should always return a fully formed url
 */
export const getUserAvatarUrl = (user: Pick<User, "avatarUrl"> | undefined) => {
  if (user?.avatarUrl) {
    const isAbsoluteUrl = z.string().url().safeParse(user.avatarUrl).success;
    if (isAbsoluteUrl) {
      return user.avatarUrl;
    } else {
      return CAL_URL + user.avatarUrl;
    }
  }
  return CAL_URL + AVATAR_FALLBACK;
};
