import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Auth Check (Basic) - Only logged in users can use the proxy
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
            },
        }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (ContextMatic Proxy; +https://contextmatic.com)'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            return NextResponse.redirect(imageUrl);
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        
        // Allow images and videos
        const isImage = contentType.startsWith('image/');
        const isVideo = contentType.startsWith('video/');
        
        if (!isImage && !isVideo) {
            return NextResponse.redirect(imageUrl);
        }

        const extension = isVideo ? 'mp4' : 'png';
        const filename = `contextmatic-asset-${Date.now()}.${extension}`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('[Logo Download Error]', error);
        // Ultimate fallback: redirect to the direct URL
        return NextResponse.redirect(imageUrl);
    }
}
