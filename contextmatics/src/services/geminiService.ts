import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateContent = async (content: string, format: string): Promise<string> => {
    if (!API_KEY || API_KEY.includes('dummy')) {
        throw new Error("Missing or invalid VITE_GEMINI_API_KEY. Please check your .env file.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let prompt = "";
        switch (format) {
            case "Blog Post":
                prompt = `Repurpose the following content into a comprehensive blog post. Use a professional yet engaging tone. Structure it with a catchy title, introduction, main body with headings, and a conclusion.\n\nContent:\n${content}`;
                break;
            case "Twitter Thread":
                prompt = `Repurpose the following content into a viral Twitter (X) thread. Create 5-10 tweets. Number them (e.g., 1/8). Start with a strong hook. Use emojis where appropriate.\n\nContent:\n${content}`;
                break;
            case "Email Newsletter":
                prompt = `Repurpose the following content into an engaging email newsletter. Include a subject line, a warm greeting, the main value proposition, and a call to action.\n\nContent:\n${content}`;
                break;
            case "LinkedIn Post":
                prompt = `Repurpose the following content into a professional LinkedIn post. Focus on thought leadership and industry insights. Use appropriate hashtags and spacing for readability.\n\nContent:\n${content}`;
                break;
            case "Summary":
                prompt = `Provide a concise summary of the following content. Capture the key points and main takeaways in bullet points.\n\nContent:\n${content}`;
                break;
            default:
                prompt = `Repurpose the following content into ${format}:\n\n${content}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content. Please try again.");
    }
};
