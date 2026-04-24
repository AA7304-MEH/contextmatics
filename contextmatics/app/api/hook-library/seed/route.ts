import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/providers';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

const HOOK_TYPES = ["Negative", "Question", "Contrarian", "Statistical", "Story", "How-to", "Mistake", "Direct"];
const PLATFORMS = ["Twitter", "LinkedIn", "Instagram", "Threads", "TikTok", "YouTube Shorts"];
const NICHES = ["SaaS", "Content Creation", "E-commerce", "Health/Fitness", "Personal Finance", "Real Estate", "Artificial Intelligence"];
const LANGUAGES = ["English", "Hinglish"];

/**
 * Calculates string similarity using Jaccard Similarity (of words)
 */
function getSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export async function POST(_req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  // Only allow admins to seed (using metadata role check)
  if (user.user_metadata?.role !== 'admin' && user.email !== 'alok.parmar.dev@gmail.com') {
      return NextResponse.json({ success: false, code: 'FORBIDDEN', message: 'Admin access required' }, { status: 403 });
  }

  try {
    let totalHooksGenerated = 0;
    const existingHooks: string[] = [];
    const allHooksToInsert:any[] = [];

    // Process in batches
    for (const language of LANGUAGES) {
      for (const niche of NICHES) {
        logger.info(`Seeding hooks for ${niche} in ${language}`, { userId: user.id });
        
        const prompt = `
          Generate 50 viral hooks for the ${niche} niche in ${language}.
          Cover these hook types: ${HOOK_TYPES.join(', ')}.
          Cover these platforms: ${PLATFORMS.join(', ')}.
          
          If the language is Hinglish, use a natural mix of Hindi and English in Roman script (natural Indian social media style).
          
          Return a JSON array of objects with these fields:
          hook_text, hook_type, platform, description.
          
          IMPORTANT: DO NOT repeat hooks. Make them extremely punchy and "scroll-stopping".
        `;

        const text = await generateText({
          routeType: 'long_form',
          prompt,
          jsonMode: true,
        });

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const hooks = JSON.parse(jsonMatch[0]);
          
          for (const hook of hooks) {
            // Deduplication pass (60% threshold)
            const isDuplicate = existingHooks.some(existing => getSimilarity(hook.hook_text, existing) > 0.6);
            
            if (!isDuplicate) {
              allHooksToInsert.push({
                hook_template: hook.hook_text,
                hook_type: (hook.hook_type || 'statement').toLowerCase(),
                platform: (hook.platform || 'general').toLowerCase(),
                niche: niche,
                language: language.toLowerCase(),
                usage_count: 0
              });
              existingHooks.push(hook.hook_text);
              totalHooksGenerated++;
            }
          }
        }
        
        // Batch insert every niche
        if (allHooksToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('hook_library')
            .insert(allHooksToInsert);
          
          if (insertError) {
              logger.error(`Batch hook insertion failed: ${insertError.message}`, { userId: user.id });
          }
          allHooksToInsert.length = 0; 
        }
      }
    }

    return NextResponse.json({ 
       success: true, 
       data: {
         totalGenerated: totalHooksGenerated, 
         message: `Seeded ${totalHooksGenerated} unique hooks successfully.` 
       }
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to seed hook library', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'SEED_FAILED', message: errorMessage }, { status: 500 });
  }
}
