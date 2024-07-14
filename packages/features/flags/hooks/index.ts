import type { AppFlags } from "@sln/features/flags/config";
import { trpc } from "@sln/trpc/react";

const initialData: Partial<AppFlags> = process.env.NEXT_PUBLIC_IS_E2E
  ? { organizations: true, teams: true }
  : {};
export function useFlags(): Partial<AppFlags> {
  const query = trpc.viewer.features.map.useQuery(undefined, {
    initialData,
  });
  return query.data ?? {};
}
