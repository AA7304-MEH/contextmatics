import { LogoGenerationRequest } from '../types';

/**
 * Logo Generator Service
 * Ported from ailogomaker with enhancements for ContextMatic
 */
export class LogoGeneratorService {
    private static instance: LogoGeneratorService;

    private config = {
        free: {
            provider: 'pollinations',
            url: 'https://pollinations.ai/p/'
        },
        basic: {
            provider: 'huggingface',
            models: [
                'stabilityai/stable-diffusion-xl-base-1.0',
                'runwayml/stable-diffusion-v1-5'
            ]
        },
        premium: {
            provider: 'openai',
            url: 'https://api.openai.com/v1/images/generations'
        }
    };

    private constructor() { }

    static getInstance(): LogoGeneratorService {
        if (!LogoGeneratorService.instance) {
            LogoGeneratorService.instance = new LogoGeneratorService();
        }
        return LogoGeneratorService.instance;
    }

    private getApiKeys(type: 'huggingface' | 'openai'): string[] {
        // In a real app, these should be handled securely. 
        // For this port, we'll use the ones from the source if available, 
        // but prefer env variables if they exist.

        if (type === 'huggingface') {
            const envKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
            return envKey ? [envKey] : [];
        }

        if (type === 'openai') {
            const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
            return envKey ? [envKey] : [];
        }

        return [];
    }

    async generate(request: LogoGenerationRequest): Promise<string> {
        const { prompt, width = 1024, height = 1024 } = request;

        console.log('Generating logo with waterfall approach...');

        // 1. Try OpenAI (Premium Quality)
        const openaiKeys = this.getApiKeys('openai');
        if (openaiKeys.length > 0) {
            console.log('Testing OpenAI (DALL-E 3)...');
            for (const key of openaiKeys) {
                try {
                    const response = await fetch(this.config.premium.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${key}`
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
                        return `data:image/png;base64,${data.data[0].b64_json}`;
                    }
                    console.error('OpenAI Error Details:', { status: response.status, error: data.error });
                } catch (e) {
                    console.warn('OpenAI fetch failed:', e);
                }
            }
        }

        // 2. Try HuggingFace (High Quality)
        const hfKeys = this.getApiKeys('huggingface');
        if (hfKeys.length > 0) {
            console.log('Falling back to HuggingFace...');
            for (const key of hfKeys) {
                try {
                    const model = this.config.basic.models[Math.floor(Math.random() * this.config.basic.models.length)];
                    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json',
                            'x-use-cache': 'false',
                            'x-wait-for-model': 'true'
                        },
                        body: JSON.stringify({ inputs: prompt })
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                    } else {
                        const err = await response.text();
                        console.error('HuggingFace Error Details:', { status: response.status, error: err });
                    }
                } catch (e) {
                    console.warn('HuggingFace failed:', e);
                }
            }
        }

        // 3. Try Pollinations (Free - Robust)
        console.log('Falling back to Pollinations...');
        try {
            const result = await this.generatePollinations(prompt, width, height);
            if (result) return result;
        } catch (e) {
            console.warn('Pollinations failed:', e);
        }

        // 4. Try Hercai (Free Fallback - No Cloudflare 1033)
        console.log('Falling back to Hercai (Free Alternative)...');
        return this.generateHercai(prompt);
    }

    private async generatePollinations(prompt: string, width: number, height: number): Promise<string> {
        const cleanPrompt = prompt.replace(/[\n\r\t]/g, ' ').replace(/[^a-zA-Z0-9\s\-\,]/g, ' ').replace(/\s+/g, ' ').trim();
        const url = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const blob = await response.blob();
                if (blob.size > 2000) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                }
            }
            throw new Error(`Pollinations returned status ${response.status}`);
        } catch (e) {
            console.warn('Pollinations fetch failed, returning URL directly if not 1033');
            // If it's a 1033 we shouldn't return the URL as it won't load in img tag either
            // But we don't know for sure without checking text. 
            // For now, let's try to proceed to next fallback.
            throw e;
        }
    }

    private async generateHercai(prompt: string): Promise<string> {
        try {
            const cleanPrompt = encodeURIComponent(prompt.substring(0, 400));
            // Hercai v3 - Text to Image
            const url = `https://hercai.onrender.com/v3/text2image?prompt=${cleanPrompt}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.url) {
                return data.url;
            }
            return '';
        } catch (e) {
            console.error('Hercai failed:', e);
            return '';
        }
    }

}

export const logoGeneratorService = LogoGeneratorService.getInstance();
