import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';

async function brandVoiceScoreHandler(req: NextRequest) {
  try {
    const { content, fingerprint } = await req.json();

    if (!content || !fingerprint) {
      return NextResponse.json({ error: 'Content and fingerprint are required' }, { status: 400 });
    }

    const prompt = `
      Compare this social media post against the user's brand voice fingerprint and score it from 0-100.
      0 = No match at all.
      100 = Sounds exactly like the user.

      User's Voice Fingerprint:
      ${JSON.stringify(fingerprint, null, 2)}

      Generated Content:
      ${content}

      Return a JSON object with these fields:
      score (number 0-100), explanation (strictly 1 line, max 15 words).
    `;

    const text = await generateText({
      routeType: 'voice_analysis',
      prompt,
      jsonMode: true,
    });
    
    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI failed to generate a score");
    }

    const scoreData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(scoreData);
  } catch (error:any) {
    console.error('Brand voice scoring error:', error);
    return NextResponse.json({ error: 'Failed to score content' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(brandVoiceScoreHandler, {
  requireCredits: 0, // No credits for scoring for now, or minimal
  actionName: 'Score Brand Voice'
});
