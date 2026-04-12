import { NextRequest, NextResponse } from 'next/server';
import replicate from '@/lib/replicate/client';
import { withAuthAndCredits } from '@/lib/api-utils';

async function repurposeVideoHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
  try {
    const { script } = await req.json();

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    let videoUrl = '';

    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your_replicate_api_token_here') {
      console.warn('REPLICATE_API_TOKEN is missing. Using mock response.');
      videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; 
    } else {
      // For repurposing, we use the script as the prompt or a part of it
      const prompt = `Vertical cinematic video illustrating this script: ${script}. High quality, photorealistic, cinematic lighting.`;

      const output: any = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f7434164222da8061486847841572007823f66c9ff9ae03541bdc60f47c0133",
        {
          input: {
            prompt: prompt,
            num_frames: 24,
            fps: 8,
            width: 320,
            height: 576, // Vertical
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
        prompt: script.substring(0, 100) + '...', // Store a snippet of the script
        url: videoUrl,
        metadata: { script, isRepurpose: true }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving media item:', error);
    }

    return NextResponse.json({ url: videoUrl, item: data });
  } catch (error: any) {
    console.error('Video repurpose error:', error);
    return NextResponse.json({ error: error.message || 'Failed to repurpose video' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(repurposeVideoHandler, {
  requireCredits: 15,
  actionName: 'Repurpose Media'
});
