import { client } from "@gradio/client";

/**
 * Gradio Service - Integrates AI models hosted on Gradio/HuggingFace Spaces
 */
export class GradioService {
    private static instance: GradioService;
    
    // Default high-performance models on HF Spaces
    private models = {
        text: "HuggingFaceH4/zephyr-7b-beta",
        image: "stabilityai/stable-diffusion-xl-base-1.0" // More reliable/standard SDXL
    };

    private constructor() {}

    static getInstance(): GradioService {
        if (!GradioService.instance) {
            GradioService.instance = new GradioService();
        }
        return GradioService.instance;
    }

    /**
     * General prediction for Gradio-hosted text models
     */
    async predictText(prompt: string, modelPath: string = this.models.text): Promise<string> {
        try {
            const app = await client(modelPath);
            const result = await app.predict("/chat", [
                prompt, // message
                [],     // history
                "You are a professional AI assistant.", // system prompt
            ]);

            if (result && result.data && Array.isArray(result.data)) {
                // Return the first string-like output
                return result.data[0] as string;
            }
            throw new Error("Invalid response from Gradio model");
        } catch (error: any) {
            console.error(`[GradioService] Error predicting text with ${modelPath}:`, error.message);
            throw error;
        }
    }

    /**
     * General prediction for Gradio-hosted image models (e.g., FLUX, SDXL)
     */
    async generateImage(prompt: string, modelPath: string = this.models.image): Promise<string> {
        try {
            const app = await client(modelPath);
            const result = await app.predict("/infer", [
                prompt,  // prompt
                Math.floor(Math.random() * 1000000), // seed
                true,    // randomize_seed
                1024,    // width
                1024,    // height
                4,       // num_inference_steps
            ]);

            if (result && result.data && Array.isArray(result.data)) {
                // The output is usually a URL or a file object in Gradio
                const output = result.data[0];
                if (typeof output === 'string') return output;
                if (output && typeof output === 'object' && (output as any).url) {
                    return (output as any).url;
                }
            }
            throw new Error("Invalid image response from Gradio model");
        } catch (error: any) {
            console.error(`[GradioService] Image generation error with ${modelPath}:`, error.message);
            throw error;
        }
    }
}

export const gradioService = GradioService.getInstance();
