import { GoogleGenAI } from "@google/genai";
import type { RepurposeOption, Job, PlanId } from '../types';

// IMPORTANT: This key is exposed on the client-side for demonstration purposes ONLY.
// In a real production application, you should proxy all API calls through your own
// backend server to protect your API key.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. Using a placeholder key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const getPromptForOption = (option: RepurposeOption, content: string): string => {
    switch (option) {
        case 'summary':
            return `Summarize the following content concisely for a busy executive. Focus on the key takeaways and action items:\n\n---\n\n${content}`;
        case 'tweet_thread':
            return `Convert the following content into a compelling and engaging Twitter (X) thread. Each tweet should be numbered and under 280 characters. Use emojis and hashtags where appropriate. Start with a strong hook:\n\n---\n\n${content}`;
        case 'blog_post':
            return `Expand the following content into a well-structured blog post of about 500-700 words. Use headings, subheadings, and bullet points to improve readability. The tone should be informative and engaging:\n\n---\n\n${content}`;
        case 'linkedin_post':
            return `Transform the following content into a professional LinkedIn post. Start with a strong hook to capture attention. Use relevant hashtags and a call to action:\n\n---\n\n${content}`;
        case 'email_newsletter':
            return `Rewrite the following content as an email newsletter. Include a catchy subject line, a brief introduction, the main body of content formatted for easy reading, and a concluding paragraph with a call to action:\n\n---\n\n${content}`;
        default:
            throw new Error('Invalid repurpose option');
    }
};

const getJobsDB = (): Record<string, Job> => {
    try {
        const db = localStorage.getItem('contextmatic_jobs');
        return db ? JSON.parse(db) : {};
    } catch (e) {
        return {};
    }
};

const saveJobsDB = (db: Record<string, Job>) => {
    localStorage.setItem('contextmatic_jobs', JSON.stringify(db));
};

const updateJob = (jobId: string, updates: Partial<Job>) => {
    const db = getJobsDB();
    if (db[jobId]) {
        db[jobId] = { ...db[jobId], ...updates };
        saveJobsDB(db);
    }
};

export const startRepurposingJob = async (
    content: string,
    option: RepurposeOption,
    userPlan: PlanId
): Promise<string> => {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newJob: Job = {
        id: jobId,
        status: 'queued',
        progress: 0,
        createdAt: Date.now(),
    };
    
    const db = getJobsDB();
    db[jobId] = newJob;
    saveJobsDB(db);

    // --- Simulate the background worker ---
    const runJob = async () => {
        try {
            // 1. Processing Stage
            updateJob(jobId, { status: 'processing', progress: 25 });
            await new Promise(res => setTimeout(res, 2000));

            // 2. Analyzing Stage
            updateJob(jobId, { status: 'analyzing', progress: 60 });
            await new Promise(res => setTimeout(res, 3000));

            // 3. Call actual API
            if (!API_KEY) {
                let mockResult = `This is a mock response for "${option}" from job ${jobId}. The original content was: "${content.substring(0, 100)}..."`;
                if (userPlan === 'free') {
                    mockResult += '\n\n---\nRepurposed with ContextMatic';
                }
                 updateJob(jobId, { status: 'complete', progress: 100, result: mockResult });
                 return;
            }

            const prompt = getPromptForOption(option, content);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            let result = response.text;

            if (userPlan === 'free') {
                result += '\n\n---\nRepurposed with ContextMatic';
            }
            
            updateJob(jobId, { status: 'complete', progress: 100, result });

        } catch (error) {
            console.error("Error processing job:", error);
            const errorMessage = (error as Error).message || "An unknown error occurred.";
            updateJob(jobId, { status: 'failed', progress: 100, error: `Failed to repurpose content: ${errorMessage}` });
        }
    };

    runJob(); // Fire and forget
    
    return jobId;
};

export const getJob = async (jobId: string): Promise<Job | null> => {
    const db = getJobsDB();
    return db[jobId] || null;
}