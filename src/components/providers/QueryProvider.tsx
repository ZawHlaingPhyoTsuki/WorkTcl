"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes (data stays fresh)
      refetchOnWindowFocus: false, // Avoid refetch on tab switch
      refetchOnReconnect: true, // Refetch if network was offline
      refetchOnMount: true, // Refetch when component mounts (but respects staleTime)
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
