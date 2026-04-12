import { LogoGenerationRequest } from '../types';

/**
 * Logo Generator Service
 * Ported from ailogomaker with enhancements for ContextMatic
 */
export class LogoGeneratorService {
    private static instance: LogoGeneratorService;

    private constructor() { }

    static getInstance(): LogoGeneratorService {
        if (!LogoGeneratorService.instance) {
            LogoGeneratorService.instance = new LogoGeneratorService();
        }
        return LogoGeneratorService.instance;
    }

    async generate(request: LogoGenerationRequest): Promise<string> {
        const { prompt, width = 1024, height = 1024 } = request;

        // 1. Try secure server-side generation (OpenAI & HuggingFace)
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
                    return data.image;
                }
            }
        } catch (e) {
            // Server-side generation request failed, fallback to client-side
        }

        // 2. Try Pollinations (Free - Robust)
        try {
            const result = await this.generatePollinations(prompt, width, height);
            if (result) return result;
        } catch (e) {
            // Pollinations failed
        }

        // 3. Try Hercai (Free Fallback)
        return this.generateHercai(prompt);
    }

    private async generatePollinations(prompt: string, width: number, height: number): Promise<string> {
        const cleanPrompt = prompt.replace(/[\n\r\t]/g, ' ').replace(/[^a-zA-Z0-9\s\-\,]/g, ' ').replace(/\s+/g, ' ').trim();
        return `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
    }

    private async generateHercai(prompt: string): Promise<string> {
        const cleanPrompt = encodeURIComponent(prompt.substring(0, 400));
        return `https://hercai.onrender.com/v3/text2image?prompt=${cleanPrompt}`;
    }

}

export const logoGeneratorService = LogoGeneratorService.getInstance();
