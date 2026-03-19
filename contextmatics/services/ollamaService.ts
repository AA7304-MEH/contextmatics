/**
 * Ollama Service - Local LLM Orchestrator
 * Communicates with the local Ollama instance (default: http://localhost:11434)
 */

export interface OllamaResponse {
    model: string;
    created_at: string;
    message: {
        role: string;
        content: string;
    };
    done: boolean;
}

const getOllamaUrl = () => {
    const envUrl = process.env.OLLAMA_URL || process.env.NEXT_PUBLIC_OLLAMA_URL;
    if (envUrl) {
        return envUrl.endsWith('/api/chat') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/chat`;
    }
    return "http://localhost:11434/api/chat";
};

const OLLAMA_URL = getOllamaUrl();
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export const ollamaService = {
    /**
     * Sends a chat request to the Ollama instance (Local or Remote)
     */
    chat: async (prompt: string, systemPrompt?: string): Promise<string> => {
        const isRemote = !OLLAMA_URL.includes('localhost') && !OLLAMA_URL.includes('127.0.0.1');
        console.log(`[OllamaService] Targeting ${isRemote ? 'REMOTE' : 'LOCAL'} model: ${DEFAULT_MODEL} at ${OLLAMA_URL}`);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), isRemote ? 30000 : 8000); // Fast timeout for local to trigger fallback

            const response = await fetch(OLLAMA_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: DEFAULT_MODEL,
                    messages: [
                        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
                        { role: "user", content: prompt }
                    ],
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data: OllamaResponse = await response.json();
                console.log(`[OllamaService] Success with Ollama`);
                return data.message.content;
            }
        } catch (error: any) {
            console.warn(`[OllamaService] Ollama unreachable or timed out. Falling back to keyless Cloud AI...`);
        }

        // AUTO-FALLBACK: Keyless Cloud AI (Pollinations / Hercai)
        // This ensures "No-Key" mode works on Vercel (where localhost is unreachable)
        return await ollamaService.freeCloudChat(prompt, systemPrompt);
    },

    /**
     * KEYLESS CLOUD AI: Purely free, no-key text generation API
     */
    freeCloudChat: async (prompt: string, systemPrompt?: string): Promise<string> => {
        console.log(`[OllamaService] Activating Keyless Cloud AI (Pollinations)...`);
        try {
            // Pollinations Text API is very reliable and free
            const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`);
            
            if (response.ok) {
                const text = await response.text();
                if (text && text.length > 5) {
                    console.log(`[OllamaService] Success with Keyless Cloud AI`);
                    return text;
                }
            }
        } catch (e) {
            console.warn(`[OllamaService] Keyless Cloud AI failed, using Hercai...`);
        }

        // Final local fallback
        return `[Ollama/Cloud AI Offline] Unable to reach local or cloud AI. Please ensure Ollama is running or check your internet connection.`;
    }
};
