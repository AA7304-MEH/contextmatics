import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        console.log(`[Logo Download] Proxying download for: ${imageUrl}`);
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`[Logo Download] External fetch failed: ${response.status} ${response.statusText}`);
            return new NextResponse(`Error: Remote server returned ${response.status}`, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';
        const extension = contentType.split('/')[1]?.split(';')[0] || 'png';
        const filename = `contextmatic-logo-${Date.now()}.${extension}`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('[Logo Download Error]', error);
        return new NextResponse(`Error: Internal proxy failure`, { status: 500 });
    }
}
