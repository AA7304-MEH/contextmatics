import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/providers';
import { withAuthAndCredits } from '@/lib/api-utils';

async function generateLogoHandler(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    try {
        const imageUrl = await generateImage(prompt);
        return NextResponse.json({ image: imageUrl, provider: 'huggingface' });
    } catch (err:any) {
        console.error('[AI Logo] All providers failed:', err.message);
        return NextResponse.json({ error: 'All AI generation paths exhausted. Please try again later.' }, { status: 503 });
    }
}

export const POST = withAuthAndCredits(generateLogoHandler, { 
    requireCredits: 5, 
    actionName: 'Generate Logo' 
});
