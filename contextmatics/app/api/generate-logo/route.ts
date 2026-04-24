import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { generateImage } from '@/lib/ai/providers';

async function generateLogoHandler(req: NextRequest, { user, supabase, deductCredits }:any) {
  try {
    const { prompt, style = 'minimalist' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const logoPrompt = `High-quality, professional ${style} logo for "${prompt}". flat vector, minimalistic, clean lines, white background, high resolution, 8k.`;

    const imageUrl = await generateImage(logoPrompt);

    // Deduct credits after successful AI call
    await deductCredits();

    // Save to media_items
    const { data, error } = await supabase
      .from('media_items')
      .insert({
        user_id: user.id,
        type: 'logo',
        prompt: prompt,
        url: imageUrl,
        metadata: { style, logoPrompt }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving media item:', error);
    }

    return NextResponse.json({ url: imageUrl, item: data });
  } catch (error:any) {
    console.error('Logo generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate logo' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateLogoHandler, {
  requireCredits: 5,
  actionName: 'Generate Logo'
});
