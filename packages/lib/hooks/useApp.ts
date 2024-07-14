import { useSession } from "next-auth/react";

import { trpc } from "@sln/trpc/react";

export default function useApp(appId: string) {
  const { status } = useSession();

  return trpc.viewer.appById.useQuery(
    { appId },
    {
      enabled: status === "authenticated",
    }
  );
}
