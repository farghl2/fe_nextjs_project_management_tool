'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry on 4xx errors – they are expected/handled
        retry: (failureCount, error) => {
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        staleTime: 1000 * 60 * 3, // 3 minutes default
        refetchOnWindowFocus: false,
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
      mutations: {
        retry: false,
      },
    },
  });
}

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // useState ensures a single QueryClient instance per component lifecycle
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
