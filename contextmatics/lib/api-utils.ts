import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { logger } from './logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthContext {
    user: AuthenticatedUser;
    supabase: SupabaseClient;
    credits: number;
    deductCredits: () => Promise<void>;
}

export const PLAN_HIERARCHY = {
  'free': 0,
  'pro': 1,
  'business': 2,
  'enterprise': 3
} as const;

export interface PlanGateOptions {
  requiredPlan: keyof typeof PLAN_HIERARCHY;
  userId: string;
}

export interface ApiHandlerOptions {
  requireAuth?: boolean;
  requirePlan?: PlanGateOptions['requiredPlan'];
  requireCredits?: number;
  rateLimit?: number;
  rateLimitWindow?: string; // e.g. "3600 s" for per-hour, defaults to "60 s"
  actionName: string;
}

export type ApiHandler = (req: NextRequest, context: AuthContext & { params?:any }) => Promise<NextResponse<any>>;

/**
 * Higher-order function to wrap API routes with Auth, Credits, and Error Handling
 */
export function withAuthAndCredits(handler: ApiHandler, options: ApiHandlerOptions) {
    return async (req: NextRequest, routeContext:any) : Promise<NextResponse> => {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        try {
            // 1. Session Check
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Unauthorized. Please sign in.' }, { status: 401 });
            }

            const authenticatedUser: AuthenticatedUser = {
                id: user.id,
                email: user.email || ''
            };

            // 2. Fetch Profile/Credits
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'User profile not found.' }, { status: 404 });
            }

            const profileData = profile as Profile;
            const credits = profileData.credits_remaining;

            // 3. Rate Limiting (Upstash Redis)
            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                const redis = new Redis({
                    url: process.env.UPSTASH_REDIS_REST_URL,
                    token: process.env.UPSTASH_REDIS_REST_TOKEN,
                });
                const ratelimit = new Ratelimit({
                    redis: redis,
                    limiter: Ratelimit.slidingWindow(
                        options.rateLimit || 10,
                        (options.rateLimitWindow || '60 s') as Parameters<typeof Ratelimit.slidingWindow>[1]
                    ),
                    analytics: true,
                    prefix: "@upstash/ratelimit",
                });

                const { success, reset } = await ratelimit.limit(`ratelimit_${user.id}_${options.actionName}`);
                if (!success) {
                    return NextResponse.json({ 
                        success: false, 
                        code: 'RATE_LIMITED', 
                        message: 'Rate limit exceeded. Please wait.',
                        retryAfter: 60,
                        reset 
                    }, { 
                        status: 429 
                    });
                }
            }

            let newCredits = credits;

            // 4. Plan Gating
            if (options.requirePlan) {
                const userPlan = (profileData.plan?.toLowerCase() || 'free') as keyof typeof PLAN_HIERARCHY;
                const requiredPlan = options.requirePlan.toLowerCase() as keyof typeof PLAN_HIERARCHY;
                
                if ((PLAN_HIERARCHY[userPlan] || 0) < (PLAN_HIERARCHY[requiredPlan] || 0)) {
                    return NextResponse.json({ 
                        success: false,
                        code: 'PLAN_REQUIRED',
                        message: `Feature reserved for ${options.requirePlan.toUpperCase()} users.`,
                        requiredPlan: options.requirePlan,
                        upgradeUrl: '/pricing'
                    }, { status: 403 });
                }
            }

            // 5. Credits Check
            if (options.requireCredits && newCredits < options.requireCredits) {
                return NextResponse.json({ 
                    success: false,
                    code: 'INSUFFICIENT_CREDITS',
                    message: 'Insufficient credits.', 
                    remaining: newCredits,
                    upgradeUrl: '/pricing'
                }, { status: 402 });
            }

            const deductCredits = async () => {
                if (!options.requireCredits) return;
                const { useCredits } = await import('@/lib/useCredits');
                const result = await useCredits(user.id, options.requireCredits);
                newCredits = result.remaining;
            };

            // 6. Execute Handler
            return await handler(req, { 
                user: authenticatedUser, 
                supabase, 
                credits: newCredits, 
                deductCredits,
                params: routeContext?.params
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const { data: { user } } = await supabase.auth.getUser();
            
            logger.error(`[API Error: ${options.actionName}]`, {
                userId: user?.id || 'unauthenticated',
                path: req.nextUrl.pathname,
                error: errorMessage
            });
            
            return NextResponse.json({ 
                success: false,
                code: 'SERVER_ERROR',
                message: 'An unexpected error occurred.'
            }, { status: 500 });
        }
    };
}

export function checkPlanGate(userPlan: string, requiredPlan: string): boolean {
    const uPlan = (userPlan.toLowerCase() || 'free') as keyof typeof PLAN_HIERARCHY;
    const rPlan = (requiredPlan.toLowerCase() || 'free') as keyof typeof PLAN_HIERARCHY;
    return (PLAN_HIERARCHY[uPlan] || 0) >= (PLAN_HIERARCHY[rPlan] || 0);
}
