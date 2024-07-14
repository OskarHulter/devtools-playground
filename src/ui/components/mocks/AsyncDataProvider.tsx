import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockedAsyncDataProvider = () => null;//<AppRouter>();
export const StorybookTrpcProvider = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(
		new QueryClient({
			defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
		}),
	);

	const [trpcClient] = useState(() =>
		mockedAsyncDataProvider.createClient({
			links: ['/products'],
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
