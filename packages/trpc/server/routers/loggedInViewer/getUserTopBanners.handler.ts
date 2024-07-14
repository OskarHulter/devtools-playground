import { checkIfOrgNeedsUpgradeHandler } from "../viewer/organizations/checkIfOrgNeedsUpgrade.handler";
import { getUpgradeableHandler } from "../viewer/teams/getUpgradeable.handler";
import { checkInvalidAppCredentials } from "./checkForInvalidAppCredentials";
import { shouldVerifyEmailHandler } from "./shouldVerifyEmail.handler";
import {
  getCalendarCredentials,
  getConnectedCalendars,
} from "@sln/core/CalendarManager";
import { prisma } from "@sln/prisma";
import { credentialForCalendarServiceSelect } from "@sln/prisma/selects/credential";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type Props = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

const checkInvalidGoogleCalendarCredentials = async ({ ctx }: Props) => {
  const userCredentials = await prisma.credential.findMany({
    where: {
      userId: ctx.user.id,
      type: "google_calendar",
    },
    select: credentialForCalendarServiceSelect,
  });

  const calendarCredentials = getCalendarCredentials(userCredentials);

  const { connectedCalendars } = await getConnectedCalendars(
    calendarCredentials,
    ctx.user.selectedCalendars,
    ctx.user.destinationCalendar?.externalId
  );

  return connectedCalendars.some((calendar) => !!calendar.error);
};

export const getUserTopBannersHandler = async ({ ctx }: Props) => {
  const upgradeableTeamMememberships = getUpgradeableHandler({
    userId: ctx.user.id,
  });
  const upgradeableOrgMememberships = checkIfOrgNeedsUpgradeHandler({ ctx });
  const shouldEmailVerify = shouldVerifyEmailHandler({ ctx });
  const isInvalidCalendarCredential = checkInvalidGoogleCalendarCredentials({
    ctx,
  });
  const appsWithInavlidCredentials = checkInvalidAppCredentials({ ctx });

  const [
    teamUpgradeBanner,
    orgUpgradeBanner,
    verifyEmailBanner,
    calendarCredentialBanner,
    invalidAppCredentialBanners,
  ] = await Promise.allSettled([
    upgradeableTeamMememberships,
    upgradeableOrgMememberships,
    shouldEmailVerify,
    isInvalidCalendarCredential,
    appsWithInavlidCredentials,
  ]);

  return {
    teamUpgradeBanner:
      teamUpgradeBanner.status === "fulfilled" ? teamUpgradeBanner.value : [],
    orgUpgradeBanner:
      orgUpgradeBanner.status === "fulfilled" ? orgUpgradeBanner.value : [],
    verifyEmailBanner:
      verifyEmailBanner.status === "fulfilled"
        ? !verifyEmailBanner.value.isVerified
        : false,
    calendarCredentialBanner:
      calendarCredentialBanner.status === "fulfilled"
        ? calendarCredentialBanner.value
        : false,
    invalidAppCredentialBanners:
      invalidAppCredentialBanners.status === "fulfilled"
        ? invalidAppCredentialBanners.value
        : [],
  };
};
