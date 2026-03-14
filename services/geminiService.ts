const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateContent = async (content: string, format: string): Promise<string> => {
    try {
        const response = await fetch('/api/ai/repurpose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, format })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'AI Content Generation failed');
        }

        return data.text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("AI Content Generation failed. Please try again later.");
    }
};

