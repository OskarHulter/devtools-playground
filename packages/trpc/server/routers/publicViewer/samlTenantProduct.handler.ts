import type { TSamlTenantProductInputSchema } from "./samlTenantProduct.schema";
import { ssoTenantProduct } from "@sln/features/ee/sso/lib/sso";
import type { PrismaClient } from "@sln/prisma";

type SamlTenantProductOptions = {
  ctx: {
    prisma: PrismaClient;
  };
  input: TSamlTenantProductInputSchema;
};

export const samlTenantProductHandler = ({
  ctx,
  input,
}: SamlTenantProductOptions) => {
  const { prisma } = ctx;
  const { email } = input;

  return ssoTenantProduct(prisma, email);
};

export default samlTenantProductHandler;
