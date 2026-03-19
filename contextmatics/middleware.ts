import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

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
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    /*
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && isProtectedRoute) {
        console.error('[Middleware] Auth error:', authError.message);
    }

    if (user) {
        console.log('[Middleware] Authenticated user:', user.email);
    }

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        url.searchParams.set('return_to', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }
    */

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
