import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { generateImage } from '@/lib/ai/providers';

async function generateImageHandler(req: NextRequest, { user, supabase, deductCredits }:any) {
  try {
    const { prompt, negativePrompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const imageUrl = await generateImage(prompt);

    // Deduct credits after successful AI call
    await deductCredits();

    // Save to media_items
    const { data, error } = await supabase
      .from('media_items')
      .insert({
        user_id: user.id,
        type: 'image',
        prompt: prompt,
        url: imageUrl,
        metadata: { negativePrompt }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving media item:', error);
    }

    return NextResponse.json({ url: imageUrl, item: data });
  } catch (error:any) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate image' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateImageHandler, {
  requireCredits: 5,
  actionName: 'Generate Image'
});
