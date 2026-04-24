'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { AuthProvider } from '@/context/AuthContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { VideoProvider } from '@/context/VideoContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
       posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
         api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
         person_profiles: 'identified_only',
         capture_pageview: false
       });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider client={posthog}>
        <AuthProvider>
          <HistoryProvider>
            <VideoProvider>
              {children}
            </VideoProvider>
          </HistoryProvider>
        </AuthProvider>
      </PostHogProvider>
    </QueryClientProvider>
  );
}
