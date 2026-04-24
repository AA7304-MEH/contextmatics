import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

const HOOK_TYPES = ['question','statement','controversial','story','data','curiosity','fear','aspiration'];
const PLATFORMS = ['twitter', 'linkedin', 'instagram', 'tiktok', 'facebook', 'generic'];
const NICHES = ['productivity', 'marketing', 'fitness', 'tech', 'business'];
const LANGUAGES = ['english', 'hinglish'];

async function generateHooksBatch(type, language) {
    const prompt = `Generate 30 unique social media hook templates for a "${type}" style in ${language}. 
    Structure: template (use [X] for variables), types, platform, niche.
    Platforms to cover: twitter, linkedin, instagram, tiktok, facebook, generic.
    Niches to cover: productivity, marketing, fitness, tech, business.
    Return ONLY a JSON array of objects with fields: hook_template, hook_type, platform, niche, language.
    Example: {"hook_template": "Nobody talks about [X] but it changed everything for me.", "hook_type": "${type}", "platform": "twitter", "niche": "marketing", "language": "${language}"}
    Make them viral, professional, and authentic to the ${language} language style.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error(`Error generating ${type} in ${language}:`, error);
    }
    return [];
}

async function start() {
    console.log("Starting hook generation...");
    let allHooks = [];
    
    for (const type of HOOK_TYPES) {
        for (const lang of LANGUAGES) {
            console.log(`Generating ${type} hooks in ${lang}...`);
            const batch = await generateHooksBatch(type, lang);
            allHooks = [...allHooks, ...batch];
        }
    }

    console.log(`Generated ${allHooks.length} hooks. Formatting SQL...`);
    
    let sql = "INSERT INTO public.hook_library (hook_template, hook_type, platform, niche, language) VALUES\n";
    const values = allHooks.map(h => {
        const template = h.hook_template.replace(/'/g, "''");
        return `('${template}', '${h.hook_type}', '${h.platform}', '${h.niche}', '${h.language}')`;
    });

    sql += values.join(",\n") + ";";

    fs.writeFileSync("supabase/seed-hooks.sql", sql);
    console.log("Done! Created supabase/seed-hooks.sql");
}

start();
