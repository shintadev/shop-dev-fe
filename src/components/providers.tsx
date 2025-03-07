'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before data becomes stale
      gcTime: 10 * 60 * 1000, // 10 minutes before unused data is garbage collected (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window gets focus
      refetchOnMount: false, // Don't refetch on component mount
      refetchOnReconnect: true, // Refetch on network reconnection
      retry: 1, // Only retry failed queries once
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={5 * 60} // Refresh every 5 minutes instead of default
      >
        {children}
        <Toaster position='top-right' richColors />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
