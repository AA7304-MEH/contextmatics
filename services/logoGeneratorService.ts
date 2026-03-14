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

    async generate(request: LogoGenerationRequest): Promise<string> {
        const { prompt, width = 1024, height = 1024 } = request;

        console.log('Generating logo with waterfall approach...');

        // 1. Try secure server-side generation (OpenAI & HuggingFace)
        console.log('Attempting secure server-side generation...');
        try {
            const response = await fetch('/api/ai/generate-logo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, width, height })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.image) {
                    console.log(`Success via server (${data.provider})`);
                    return data.image;
                }
            } else {
                const errData = await response.json();
                console.warn('Server generation skipped/failed:', errData.error);
            }
        } catch (e) {
            console.warn('Server-side generation request failed:', e);
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
