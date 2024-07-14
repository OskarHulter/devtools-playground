"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import LicenseRequired from "../../common/components/LicenseRequired";
import { UserForm } from "../components/UserForm";
import { userBodySchema } from "../schemas/userBodySchema";
import { getParserWithGeneric } from "@sln/prisma/zod-utils";
import { trpc } from "@sln/trpc/react";
import { Meta, showToast } from "@sln/ui";
import { usePathname, useRouter } from "next/navigation";

const UsersAddView = () => {
  const pathname = usePathname();
  const router = useRouter();
  const utils = trpc.useUtils();
  const mutation = trpc.viewer.users.add.useMutation({
    onSuccess: async () => {
      showToast("User added successfully", "success");
      await utils.viewer.users.list.invalidate();

      if (pathname !== null) {
        router.replace(pathname.replace("/add", ""));
      }
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error adding this user.", "error");
    },
  });
  return (
    <LicenseRequired>
      <Meta title="Add new user" description="Here you can add a new user." />
      <UserForm
        submitLabel="Add user"
        onSubmit={async (values) => {
          const parser = getParserWithGeneric(userBodySchema);
          const parsedValues = parser(values);
          mutation.mutate(parsedValues);
        }}
      />
    </LicenseRequired>
  );
};

UsersAddView.getLayout = getLayout;

export default UsersAddView;
