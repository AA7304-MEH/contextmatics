import { NextRequest, NextResponse } from 'next/server';
import { gradioService } from '@/services/gradioService';

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

        // 0. Try Gradio (State-of-the-art: FLUX.1)
        try {
            console.log(`[AI Logo] Attempting with Gradio (FLUX.1)...`);
            const imageUrl = await gradioService.generateImage(prompt);
            if (imageUrl) {
                console.log(`[AI Logo] Success with Gradio (FLUX.1)`);
                return NextResponse.json({ image: imageUrl, provider: 'gradio-flux' });
            }
        } catch (gradioErr: any) {
            console.warn(`[AI Logo] Gradio failed, falling back to OpenAI...`);
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

        // 3. Try Pollinations (Free Server-side - No CORS issues for client)
        try {
            console.log(`[AI Logo] Falling back to server-side Pollinations...`);
            const cleanPrompt = prompt.replace(/[\n\r\t]/g, ' ').replace(/[^a-zA-Z0-9\s\-\,]/g, ' ').replace(/\s+/g, ' ').trim();
            const pollinationUrl = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
            
            const response = await fetch(pollinationUrl);
            if (response.ok) {
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                return NextResponse.json({ image: `data:image/png;base64,${base64}`, provider: 'pollinations-server' });
            }
        } catch (e) {
            console.warn('[AI Logo] Server-side Pollinations failed:', e);
        }

        // 4. Try Hercai (Final Server-side Fallback)
        try {
            console.log(`[AI Logo] Falling back to server-side Hercai...`);
            const hercaiUrl = `https://hercai.onrender.com/v3/text2image?prompt=${encodeURIComponent(prompt.substring(0, 400))}`;
            const response = await fetch(hercaiUrl);
            const data = await response.json();
            if (data.url) {
                const imgRes = await fetch(data.url);
                if (imgRes.ok) {
                    const blob = await imgRes.blob();
                    const buffer = await blob.arrayBuffer();
                    const base64 = Buffer.from(buffer).toString('base64');
                    return NextResponse.json({ image: `data:image/png;base64,${base64}`, provider: 'hercai-server' });
                }
            }
        } catch (e) {
            console.warn('[AI Logo] Server-side Hercai failed:', e);
        }

        return NextResponse.json({ error: 'All server-side generation paths failed' }, { status: 503 });

    } catch (error) {
        console.error('Logo Generation API Error:', error);
        return NextResponse.json({
            error: 'AI Logo Generation failed.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
