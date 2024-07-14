import { getTokenObjectFromCredential } from "./getTokenObjectFromCredential";
import prisma from "@sln/prisma";
import type { CredentialPayload } from "@sln/types/Credential";

export const markTokenAsExpired = async (credential: CredentialPayload) => {
  const tokenResponse = getTokenObjectFromCredential(credential);
  if (credential && credential.key) {
    await prisma.credential.update({
      where: {
        id: credential.id,
      },
      data: {
        key: {
          ...tokenResponse,
          expiry_date: Date.now() - 3600 * 1000,
        },
      },
    });
  }
};
