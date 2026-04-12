import { NextRequest, NextResponse } from 'next/server';
import replicate from '@/lib/replicate/client';
import { withAuthAndCredits } from '@/lib/api-utils';

async function generateVideoHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
  try {
    const { prompt, duration = 4 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let videoUrl = '';

    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your_replicate_api_token_here') {
      console.warn('REPLICATE_API_TOKEN is missing. Using mock response.');
      videoUrl = 'https://replicate.delivery/pbxt/f0E0f0e0f0e0f0e0f0e0f0e0f0e0f0e0/output.mp4'; // Placeholder
      // For dev, return a static video from public if it exists, otherwise a generic one
      videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; 
    } else {
      // Using zeroscope-v2-xl for faster video generation
      const output: any = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f7434164222da8061486847841572007823f66c9ff9ae03541bdc60f47c0133",
        {
          input: {
            prompt: prompt,
            num_frames: 24,
            fps: 8,
            width: 576,
            height: 320,
            guidance_scale: 17.5,
            num_inference_steps: 50
          }
        }
      );
      videoUrl = Array.isArray(output) ? output[0] : output;
    }

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
  } catch (error: any) {
    console.error('Video generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate video' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateVideoHandler, {
  requireCredits: 15,
  actionName: 'Generate Video'
});
