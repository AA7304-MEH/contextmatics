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
     * Weaponized for Phase 11 Remote Orchestration.
     */
    chat: async (prompt: string, systemPrompt?: string): Promise<string> => {
        const isRemote = !OLLAMA_URL.includes('localhost');
        console.log(`[OllamaService] Targeting ${isRemote ? 'REMOTE' : 'LOCAL'} model: ${DEFAULT_MODEL} at ${OLLAMA_URL}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), isRemote ? 30000 : 15000); // Higher timeout for remote AI

        try {
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

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Ollama API error (${response.status}): ${errorData || response.statusText}`);
            }

            const data: OllamaResponse = await response.json();
            return data.message.content;
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.error(`[OllamaService] Connection TIMEOUT to ${OLLAMA_URL}`);
                throw new Error('Ollama connection timed out. Remote AI hardware may be offline.');
            }
            console.warn(`[OllamaService] AI execution failed: ${error.message}`);
            throw error;
        }
    }
};
