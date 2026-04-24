'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Check if running in browser to avoid SSR errors
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
       posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
         api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
         person_profiles: 'identified_only',
         capture_pageview: false // we handle this manually usually, or true
       });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider client={posthog}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </PostHogProvider>
    </QueryClientProvider>
  );
}
