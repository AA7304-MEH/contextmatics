import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            // Build-time safety: Skip auth checks if secrets are missing
            return NextResponse.next();
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const protectedRoutes = [
        '/dashboard',
        '/content-creator',
        '/video-repurpose',
        '/video-generator',
        '/settings',
        '/history',
        '/analytics',
        '/account',
        '/subscription',
        '/templates',
        '/snippets',
        '/studio',
        '/projects',
        '/admin',
        '/onboarding',
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && isProtectedRoute) {
        console.error('[Middleware] Auth error:', authError.message);
    }

        // Admin Route Protection
        if (request.nextUrl.pathname.startsWith('/admin')) {
            if (!user) {
                const url = request.nextUrl.clone();
                url.pathname = '/sign-in';
                url.searchParams.set('return_to', request.nextUrl.pathname);
                return NextResponse.redirect(url);
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                return NextResponse.redirect(url);
            }
        }

        // Onboarding Check
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('plan, plan_expires_at, onboarding_completed, role')
                .eq('id', user.id)
                .single();

            if (profile) {
                if ((profile.plan === 'pro' || profile.plan === 'business') && profile.plan_expires_at) {
                    const expiresAt = new Date(profile.plan_expires_at);
                    if (expiresAt < new Date()) {
                        await supabase.from('profiles').update({ plan: 'free' }).eq('id', user.id);
                    }
                }

                const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');
                if (profile.onboarding_completed === false && !isOnboardingRoute && isProtectedRoute) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/onboarding';
                    return NextResponse.redirect(url);
                }
            }
        }

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        url.searchParams.set('return_to', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Referral tracking
    const ref = request.nextUrl.searchParams.get('ref');
    if (ref) {
        response.cookies.set('referral_code', ref, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    }

    } catch (error) {
        console.error('[Middleware Error]', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
