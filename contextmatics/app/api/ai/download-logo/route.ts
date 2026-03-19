import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        console.log(`[Logo Download] Proxying download for: ${imageUrl}`);
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        
        const contentType = response.headers.get('content-type') || 'image/png';
        const extension = contentType.split('/')[1] || 'png';
        const filename = `contextmatic-logo-${Date.now()}.${extension}`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('[Logo Download Error]', error);
        return NextResponse.json({ 
            error: 'Failed to proxy download', 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }
}
