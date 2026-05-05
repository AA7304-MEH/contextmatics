"use client";

/**
 * ContextMatic Analytics Engine
 * Centralized tracking for business events, AI generations, and growth loops.
 */

type AnalyticsEvent = 
  | "content_generated" 
  | "video_created" 
  | "referral_invite_sent" 
  | "workspace_created" 
  | "payment_initiated" 
  | "credit_limit_reached";

export const analytics = {
    track: async (event: AnalyticsEvent, properties: Record<string, any> = {}) => {
        try {
            // Log to console in development
            if (process.env.NODE_ENV === "development") {
                console.info(`[Analytics] ${event}`, properties);
            }

            // --- PostHog / Segment Integration Point ---
            // if (typeof window !== "undefined" && (window as any).posthog) {
            //     (window as any).posthog.capture(event, properties);
            // }

            // --- Custom Supabase Edge Function to track backend ---
            // await fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, properties }) });

        } catch (error) {
            console.error("Analytics tracking failed", error);
        }
    },

    identify: (userId: string, traits: Record<string, any> = {}) => {
        if (process.env.NODE_ENV === "development") {
            console.info(`[Analytics] Identify User: ${userId}`, traits);
        }
        // if (typeof window !== "undefined" && (window as any).posthog) {
        //     (window as any).posthog.identify(userId, traits);
        // }
    }
};
