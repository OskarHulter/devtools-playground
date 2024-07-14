"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import LicenseRequired from "../../common/components/LicenseRequired";
import { UserForm } from "../components/UserForm";
import { userBodySchema } from "../schemas/userBodySchema";
import NoSSR from "@sln/core/components/NoSSR";
import { useParamsWithFallback } from "@sln/lib/hooks/useParamsWithFallback";
import { getParserWithGeneric } from "@sln/prisma/zod-utils";
import { trpc } from "@sln/trpc/react";
import { Meta, showToast } from "@sln/ui";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";

const userIdSchema = z.object({ id: z.coerce.number() });

const UsersEditPage = () => {
  const params = useParamsWithFallback();
  const input = userIdSchema.safeParse(params);

  if (!input.success) return <div>Invalid input</div>;

  return <UsersEditView userId={input.data.id} />;
};

const UsersEditView = ({ userId }: { userId: number }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [data] = trpc.viewer.users.get.useSuspenseQuery({ userId });
  const { user } = data;
  const utils = trpc.useUtils();
  const mutation = trpc.viewer.users.update.useMutation({
    onSuccess: async () => {
      Promise.all([
        utils.viewer.users.list.invalidate(),
        utils.viewer.users.get.invalidate(),
      ]);
      showToast("User updated successfully", "success");
      router.replace(`${pathname?.split("/users/")[0]}/users`);
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error updating this user.", "error");
    },
  });
  return (
    <LicenseRequired>
      <Meta
        title={`Editing user: ${user.username}`}
        description="Here you can edit a current user."
      />
      <NoSSR>
        <UserForm
          key={JSON.stringify(user)}
          onSubmit={(values) => {
            const parser = getParserWithGeneric(userBodySchema);
            const parsedValues = parser(values);
            const data: Partial<typeof parsedValues & { userId: number }> = {
              ...parsedValues,
              userId: user.id,
            };
            // Don't send username if it's the same as the current one
            if (user.username === data.username) delete data.username;
            mutation.mutate(data);
          }}
          defaultValues={user}
        />
      </NoSSR>
    </LicenseRequired>
  );
};

UsersEditPage.getLayout = getLayout;

export default UsersEditPage;
