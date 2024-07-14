import type { TUserEmailVerificationRequiredSchema } from "./checkIfUserEmailVerificationRequired.schema";
import { extractBaseEmail } from "@sln/lib/extract-base-email";
import logger from "@sln/lib/logger";

const log = logger.getSubLogger({
  prefix: ["checkIfUserEmailVerificationRequired"],
});

export const userWithEmailHandler = async ({
  input,
}: {
  input: TUserEmailVerificationRequiredSchema;
}) => {
  const { userSessionEmail, email } = input;
  const baseEmail = extractBaseEmail(email);

  const blacklistedGuestEmails = process.env.BLACKLISTED_GUEST_EMAILS
    ? process.env.BLACKLISTED_GUEST_EMAILS.split(",")
    : [];

  const blacklistedEmail = blacklistedGuestEmails.find(
    (guestEmail: string) => guestEmail.toLowerCase() === baseEmail.toLowerCase()
  );

  if (!!blacklistedEmail && blacklistedEmail !== userSessionEmail) {
    log.warn(`blacklistedEmail: ${blacklistedEmail}`);
    return true;
  }
  return false;
};

export default userWithEmailHandler;
