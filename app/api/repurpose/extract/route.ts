import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { withAuthAndCredits } from '@/lib/api-utils';

async function extractHandler(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || !url.startsWith('http')) {
            return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
        }

        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 ContextMatic Bot' } });
        if (!response.ok) throw new Error('Failed to fetch URL content');
        
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and empty elements
        $('script, style, noscript, iframe, img, svg').remove();
        
        let text = $('article').text();
        if (!text || text.trim().length < 100) {
            text = $('body').text();
        }

        // Clean up text
        text = text.replace(/\s+/g, ' ').trim().substring(0, 15000); // limit to 15k chars to save tokens

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('Extraction error:', error);
        return NextResponse.json({ error: error.message || 'Extraction failed' }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(extractHandler, {
    requireCredits: 0,
    actionName: 'Extract URL'
});
