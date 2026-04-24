import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { generateVideo } from '@/lib/ai/providers';

async function generateVideoHandler(req: NextRequest, { user, supabase, deductCredits }:any) {
  try {
    const { prompt, duration = 4 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const videoUrl = await generateVideo(prompt);

    // Deduct credits after successful AI call
    await deductCredits();

    // Save to media_items
    const { data, error } = await supabase
      .from('media_items')
      .insert({
        user_id: user.id,
        type: 'video',
        prompt: prompt,
        url: videoUrl,
        metadata: { duration }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving media item:', error);
    }

    return NextResponse.json({ url: videoUrl, item: data });
  } catch (error:any) {
    console.error('Video generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate video' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateVideoHandler, {
  requireCredits: 15,
  actionName: 'Generate Video'
});
