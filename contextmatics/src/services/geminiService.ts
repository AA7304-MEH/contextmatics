import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateContent = async (content: string, format: string): Promise<string> => {
    // Check for dummy or missing key for Demo Mode
    if (!API_KEY || API_KEY.includes('dummy')) {
        console.debug('[Demo] Generating mock content for', format);
        await delay(2000); // Simulate network latency

        // Return mock content based on format
        switch (format) {
            case "Blog Post":
                return `[DEMO] 🚀 **Unlocking Potentials: A Deep Dive into Your Content**\n\n## Introduction\nIn today's fast-paced world, the ${content.substring(0, 20)}... is more relevant than ever. This post explores the key insights derived from the source material and how they apply to modern contexts.\n\n## Key Takeaways\n1. **Innovation is Key**: The core message highlights the importance of staying ahead.\n2. **Strategic Thinking**: leveraging ${content.substring(0, 10)}... can lead to better outcomes.\n\n## Conclusion\nBy embracing these principles, we can achieve significant growth. Remember, it's not just about ideas, but execution.\n\n*Generated in Demo Mode using ContextMatic*`;

            case "Twitter Thread":
                return `1/8 🧵 Dive into the world of ${content.substring(0, 15)}... 👇\n\n2/8 💡 The main point here is that innovation drives progress. #Tech #Growth\n\n3/8 🚀 we often overlook the simple things. ${content.substring(0, 20)}...\n\n4/8 📈 Data shows that consistency is key.\n\n5/8 ✨ "Success is a journey, not a destination."\n\n6/8 🛠️ Actionable tip: Start small, dream big.\n\n7/8 🤝 Share this if you found it useful!\n\n8/8 🔗 Read more at our website. #ContextMatic [Demo]`;

            case "Email Newsletter":
                return `Subject: 🌟 Insights on ${content.substring(0, 15)}... You Can't Miss!\n\nHi there,\n\nWe hope this week treats you well. We stumbled upon some interesting thoughts about ${content.substring(0, 20)}... and wanted to share them with you.\n\n**The Big Idea**\n${content}\n\n**Why It Matters**\nUnderstanding this can change how you approach your daily tasks.\n\n[CTA] 👉 Click here to learn more: [Link]\n\nBest,\nThe ContextMatic Team\n(Demo Mode)`;

            case "LinkedIn Post":
                return `🚀 **Thought Leadership Alert**\n\nI've been thinking a lot about ${content.substring(0, 20)}... lately.\n\nIt's fascinating how ${content} intersects with our daily professional lives.\n\nHere are 3 things to consider:\n1️⃣ Perspective shifts are necessary.\n2️⃣ Agile methodology applies everywhere.\n3️⃣ Community feedback is gold.\n\nWhat are your thoughts? Drop a comment below! 👇\n\n#Innovation #Growth #ContextMatic #Demo`;

            case "Summary":
                return `**Summary of Content**\n\n- The main topic discusses ${content.substring(0, 30)}...\n- Key argument presented is that ${content} is crucial.\n- Conclusion suggests actionable steps for improvement.\n\n*Summarized by ContextMatic AI (Demo Mode)*`;

            default:
                return `[DEMO] Repurposed content into ${format}:\n\n${content}\n\n(This is a placeholder response for Demo Mode)`;
        }
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
