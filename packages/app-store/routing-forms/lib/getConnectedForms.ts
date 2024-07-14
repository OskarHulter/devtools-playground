import type { App_RoutingForms_Form } from "@sln/prisma/client";

export default async function getConnectedForms(
  prisma: typeof import("@sln/prisma").default,
  form: Pick<App_RoutingForms_Form, "id" | "userId">
) {
  return await prisma.app_RoutingForms_Form.findMany({
    where: {
      userId: form.userId,
      routes: {
        array_contains: [
          {
            id: form.id,
            isRouter: true,
          },
        ],
      },
    },
  });
}
