import { NextRequest, NextResponse } from 'next/server';

const CONFIG = {
    basic: {
        models: [
            'stabilityai/stable-diffusion-xl-base-1.0',
            'runwayml/stable-diffusion-v1-5'
        ]
    },
    premium: {
        url: 'https://api.openai.com/v1/images/generations'
    }
};

export async function POST(req: NextRequest) {
    try {
        const { prompt, width = 1024, height = 1024 } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // 1. Try OpenAI (Premium Quality)
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey && !openaiKey.includes('your_openai_api_key')) {
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
                if (!data.error && data.data?.[0]?.b64_json) {
                    return NextResponse.json({ image: `data:image/png;base64,${data.data[0].b64_json}`, provider: 'openai' });
                }
                console.error('OpenAI Error Details:', { status: response.status, error: data.error });
            } catch (e) {
                console.warn('OpenAI fetch failed on server:', e);
            }
        }

        // 2. Try HuggingFace (High Quality)
        const hfKey = process.env.HUGGINGFACE_API_KEY;
        if (hfKey && !hfKey.includes('your_huggingface_api_key')) {
            const model = CONFIG.basic.models[Math.floor(Math.random() * CONFIG.basic.models.length)];
            try {
                const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${hfKey}`,
                        'Content-Type': 'application/json',
                        'x-use-cache': 'false',
                        'x-wait-for-model': 'true'
                    },
                    body: JSON.stringify({ inputs: prompt })
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const buffer = await blob.arrayBuffer();
                    const base64 = Buffer.from(buffer).toString('base64');
                    return NextResponse.json({ image: `data:image/png;base64,${base64}`, provider: 'huggingface' });
                } else {
                    const err = await response.text();
                    console.error('HuggingFace Error Details:', { status: response.status, error: err });
                }
            } catch (e) {
                console.warn('HuggingFace failed on server:', e);
            }
        }

        // If both fail, the client will handle the free fallbacks (Pollinations/Hercai)
        return NextResponse.json({ error: 'Server-side premium generation failed' }, { status: 503 });

    } catch (error) {
        console.error('Logo Generation API Error:', error);
        return NextResponse.json({
            error: 'AI Logo Generation failed.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
