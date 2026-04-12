import { NextRequest, NextResponse } from 'next/server';
import replicate from '@/lib/replicate/client';
import { withAuthAndCredits } from '@/lib/api-utils';

async function generateLogoHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
  try {
    const { prompt, style = 'minimalist' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const logoPrompt = `High-quality, professional ${style} logo for "${prompt}". flat vector, minimalistic, clean lines, white background, high resolution, 8k.`;

    let imageUrl = '';

    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your_replicate_api_token_here') {
      console.warn('REPLICATE_API_TOKEN is missing. Using mock response.');
      imageUrl = `https://pollinations.ai/p/${encodeURIComponent(logoPrompt)}?width=1024&height=1024&seed=42&model=flux`;
    } else {
      const output: any = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: logoPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90
          }
        }
      );
      imageUrl = Array.isArray(output) ? output[0] : output;
    }

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
  } catch (error: any) {
    console.error('Logo generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate logo' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateLogoHandler, {
  requireCredits: 5,
  actionName: 'Generate Logo'
});
