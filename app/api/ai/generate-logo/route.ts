import { NextRequest, NextResponse } from 'next/server';
import { gradioService } from '@/services/gradioService';
import { withAuthAndCredits } from '@/lib/api-utils';

const CONFIG = {
    premium: {
        url: 'https://api.openai.com/v1/images/generations'
    }
};

async function generateLogoHandler(req: NextRequest) {
    const { prompt, width = 1024, height = 1024 } = await req.json();

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 0. Try Replicate (FLUX.1-schnell) - Best for Typography/Logos
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (replicateToken && replicateToken.length > 10) {
        try {
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${replicateToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: "31e35c3ca051fb263aba3cbe113b2e5926ec0ea5e219ba382f7c020111ef293b", // Flux Schnell
                    input: {
                        prompt: prompt,
                        aspect_ratio: "1:1",
                        output_format: "png",
                        output_quality: 90
                    }
                })
            });

            const prediction = await response.json();
            if (prediction.urls?.get) {
                // Poll for result (Simplified for brevity, in full prod use webhook or a better poller)
                let imageUrl = null;
                for (let i = 0; i < 10; i++) {
                    await new Promise(r => setTimeout(r, 1500));
                    const pollRes = await fetch(prediction.urls.get, {
                        headers: { 'Authorization': `Token ${replicateToken}` }
                    });
                    const pollData = await pollRes.json();
                    if (pollData.status === 'succeeded') {
                        imageUrl = pollData.output[0];
                        break;
                    }
                }
                if (imageUrl) {
                    return NextResponse.json({ image: imageUrl, provider: 'flux-schnell-replicate' });
                }
            }
        } catch (repErr) {
            console.warn('[AI Logo] Replicate failed, falling back...');
        }
    }

    // 1. Try Gradio (SDXL-base)
    try {
        const imageUrl = await gradioService.generateImage(prompt);
        if (imageUrl) {
            return NextResponse.json({ image: imageUrl, provider: 'gradio-sdxl' });
        }
    } catch (gradioErr: any) {
        console.warn(`[AI Logo] Gradio failed, falling back...`);
    }

    // 2. Try OpenAI (DALLE-3)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.length > 20) {
        try {
            const response = await fetch(CONFIG.premium.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: `${width}x${height}`,
                    response_format: "b64_json"
                })
            });

            const data = await response.json();
            if (data.data?.[0]?.b64_json) {
                return NextResponse.json({ image: `data:image/png;base64,${data.data[0].b64_json}`, provider: 'openai' });
            }
        } catch (e) {
            console.warn('OpenAI failed:', e);
        }
    }

    return NextResponse.json({ error: 'All AI generation paths exhausted. Please try again later.' }, { status: 503 });
}

export const POST = withAuthAndCredits(generateLogoHandler, { 
    requireCredits: 5, 
    actionName: 'Generate Logo' 
});
