import prisma from "@sln/prisma";
import type { CredentialPayload } from "@sln/types/Credential";

export const invalidateCredential = async (
  credentialId: CredentialPayload["id"]
) => {
  const credential = await prisma.credential.findUnique({
    where: {
      id: credentialId,
    },
  });

  if (credential) {
    await prisma.credential.update({
      where: {
        id: credentialId,
      },
      data: {
        invalid: true,
      },
    });
  }
};
