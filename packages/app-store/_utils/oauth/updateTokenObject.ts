import type { OAuth2UniversalSchemaWithCalcomBackwardCompatibility } from "./universalSchema";
import prisma from "@sln/prisma";
import type z from "zod";

export const updateTokenObject = async ({
  tokenObject,
  credentialId,
}: {
  tokenObject: z.infer<
    typeof OAuth2UniversalSchemaWithCalcomBackwardCompatibility
  >;
  credentialId: number;
}) => {
  await prisma.credential.update({
    where: {
      id: credentialId,
    },
    data: {
      key: tokenObject,
    },
  });
};
