import { ZFormsInputSchema } from "../forms.schema";
import authedProcedure from "@sln/trpc/server/procedures/authedProcedure";

export const forms = authedProcedure
  .input(ZFormsInputSchema)
  .query(async ({ ctx, input }) => {
    const handler = (await import("../forms.handler")).default;
    return handler({ ctx, input });
  });
