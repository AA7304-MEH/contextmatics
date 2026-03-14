import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;

    const { error } = await supabase
        .from('videos') // Note: Using videos here as snippets are usually handled by the bulk delete or general route, but keeping the logic consistent with what was there
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return new NextResponse(error.message, { status: 500 });
    return new NextResponse(null, { status: 204 });
}
