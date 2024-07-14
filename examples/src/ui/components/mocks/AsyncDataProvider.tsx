import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";

import { httpBatchLink } from "@sln/trpc";
import type { AppRouter } from "@sln/trpc/server/routers/_app";

import { createTRPCReact } from "@trpc/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockedAsyncDataProvider: any = createTRPCReact<AppRouter>();
export const StorybookTrpcProvider = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(
		new QueryClient({
			defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
		}),
	);

	const [trpcClient] = useState(() =>
		mockedAsyncDataProvider.createClient({
			links: [httpBatchLink({ url: "" })],
		}),
	);

	return (
		<mockedAsyncDataProvider.Provider
			client={trpcClient}
			queryClient={queryClient}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</mockedAsyncDataProvider.Provider>
	);
};
