import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const HOOK_TYPES = ['Question', 'Statement', 'Controversial', 'Story', 'Data', 'Curiosity', 'Fear', 'Aspiration'];
const PLATFORMS = ['Twitter', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok', 'Facebook'];
const NICHES = ['SaaS', 'Marketing', 'E-commerce', 'Health', 'Finance'];
const LANGUAGES = ['English', 'Hinglish'];

async function generateHooks() {
    console.log('🚀 Starting massive hook generation...');
    
    let totalHooks = 0;

    for (const language of LANGUAGES) {
        for (const type of HOOK_TYPES) {
            console.log(`Generating ${type} hooks in ${language}...`);
            
            const prompt = `
                Generate 50 viral hook templates for social media.
                Language: ${language}
                Type: ${type}
                
                For each hook, provide:
                - hook_text (The actual hook with placeholders like [Benefit], [Time], etc.)
                - platform (Choose one from: ${PLATFORMS.join(', ')})
                - niche (Choose one from: ${NICHES.join(', ')})
                - description (Why it works)
                
                Return a JSON object with a field "hooks" which is an array of objects.
                Each object must have: hook_text, platform, niche, description.
                ${language === 'Hinglish' ? 'Ensure Hinglish hooks sound natural and use Roman script.' : ''}
            `;

            try {
                const result = await model.generateContent(prompt);
                const text = (await result.response).text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    const hooksToInsert = data.hooks.map((h: any) => ({
                        hook_type: type,
                        language: language,
                        hook_text: h.hook_text,
                        platform: h.platform,
                        niche: h.niche,
                        description: h.description,
                        usage_count: 0
                    }));

                    const { error } = await supabase.from('hook_library').insert(hooksToInsert);
                    if (error) throw error;
                    
                    totalHooks += hooksToInsert.length;
                    console.log(`✅ Inserted ${hooksToInsert.length} hooks. Total: ${totalHooks}`);
                }
            } catch (err) {
                console.error(`❌ Error in ${type}/${language}:`, err);
            }
        }
    }

    console.log(`✨ DONE! Generated ${totalHooks} hooks.`);
}

generateHooks().catch(console.error);
