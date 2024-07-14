"use client";

import { getLayout } from "../../../settings/layouts/SettingsLayout";
import { UsersTable } from "../components/UsersTable";
import NoSSR from "@sln/core/components/NoSSR";
import { Button, Meta } from "@sln/ui";

const DeploymentUsersListPage = () => {
  return (
    <>
      <Meta
        title="Users"
        description="A list of all the users in your account including their name, title, email and role."
        CTA={
          <div className="mt-4 space-x-5 sm:ml-16 sm:mt-0 sm:flex-none">
            {/* TODO: Add import users functionality */}
            {/* <Button disabled>Import users</Button> */}
            <Button href="/settings/admin/users/add">Add user</Button>
          </div>
        }
      />
      <NoSSR>
        <UsersTable />
      </NoSSR>
    </>
  );
};

DeploymentUsersListPage.getLayout = getLayout;

export default DeploymentUsersListPage;
