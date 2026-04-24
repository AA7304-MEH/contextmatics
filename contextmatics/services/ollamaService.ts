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
     * Sends a chat request to the Ollama instance (Local or Remote) with Retry Logic
     */
    chat: async (prompt: string, systemPrompt?: string, retries = 3): Promise<string> => {
        const isRemote = !OLLAMA_URL.includes('localhost') && !OLLAMA_URL.includes('127.0.0.1');
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Targeting local or remote Ollama via OLLAMA_URL
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), isRemote ? 45000 : 10000);

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
                    return data.message.content;
                }
                
                // If we get a server error, don't retry, just fail to fallback
                if (response.status >= 500) break;

            } catch (error: any) {
                // Attempt failed, backoff and retry or fallback
                
                // If last attempt failed, break to fallback
                if (attempt === retries) break;
                
                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // All Ollama attempts failed. Falling back to Cloud AI...
        return await ollamaService.freeCloudChat(prompt, systemPrompt);
    },

    /**
     * KEYLESS CLOUD AI: Purely free, no-key text generation API
     */
    freeCloudChat: async (prompt: string, systemPrompt?: string): Promise<string> => {
        try {
            // Pollinations Text API is very reliable and free
            const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`);
            
            if (response.ok) {
                const text = await response.text();
                if (text && text.length > 5) {
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
