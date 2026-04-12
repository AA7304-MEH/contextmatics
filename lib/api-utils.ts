import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface AuthContext {
    user: any;
    supabase: any;
    credits: number;
    deductCredits: () => Promise<void>;
}

export type ApiHandler = (req: NextRequest, context: AuthContext) => Promise<NextResponse>;

/**
 * Higher-order function to wrap API routes with Auth, Credits, and Error Handling
 */
export function withAuthAndCredits(handler: ApiHandler, options: { 
    requireCredits?: number, 
    actionName: string 
}) {
    return async (req: NextRequest) : Promise<NextResponse> => {
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
                return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
            }

            // 2. Fetch Profile/Credits
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('credits_remaining, plan')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
            }

            const credits = profile.credits_remaining;

            // 3. Rate Limiting (Upstash Redis)
            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                const redis = new Redis({
                    url: process.env.UPSTASH_REDIS_REST_URL,
                    token: process.env.UPSTASH_REDIS_REST_TOKEN,
                });
                const ratelimit = new Ratelimit({
                    redis: redis,
                    limiter: Ratelimit.slidingWindow(10, "60 s"),
                    analytics: true,
                    prefix: "@upstash/ratelimit",
                });

                const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${user.id}_${options.actionName}`);
                if (!success) {
                    return NextResponse.json({ 
                        error: 'Rate limit exceeded. Please wait.', 
                        limit, remaining, reset 
                    }, { 
                        status: 429,
                        headers: {
                            'X-RateLimit-Limit': limit.toString(),
                            'X-RateLimit-Remaining': remaining.toString(),
                            'X-RateLimit-Reset': reset.toString(),
                        }
                    });
                }
            }

            let newCredits = credits;

            // Optional: Provide a deduct callback if requireCredits is set.
            // We just verify they have *enough* now.
            if (options.requireCredits && newCredits < options.requireCredits) {
                return NextResponse.json({ 
                    error: 'Insufficient credits.', 
                    code: 'INSUFFICIENT_CREDITS',
                    remaining: newCredits 
                }, { status: 402 });
            }

            const deductCredits = async () => {
                if (!options.requireCredits) return;
                const { useCredits } = await import('@/lib/useCredits');
                newCredits = await useCredits(user.id, options.requireCredits);
            };

            // 5. Execute Handler (Handler is now responsible for calling deductCredits AFTER AI and BEFORE DB save)
            const response = await handler(req, { user, supabase, credits: newCredits, deductCredits });

            return response;

        } catch (error: any) {
            console.error(`[API Error: ${options.actionName}]`, error);
            return NextResponse.json({ 
                error: 'An unexpected error occurred.', 
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }, { status: 500 });
        }
    };
}
