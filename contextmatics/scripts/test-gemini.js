import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function start() {
    try {
        console.log("Testing Gemini API Key...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        const result = await model.generateContent("Hello, give me one viral social media hook about tech.");
        console.log("Success! Response:", result.response.text());
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

start();
