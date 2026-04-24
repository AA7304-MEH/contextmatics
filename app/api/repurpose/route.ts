export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import ytdl from '@distube/ytdl-core';
import Parser from 'rss-parser';
import { generateText } from '@/lib/ai/providers';
import { RepurposeJob } from '@/types/database';
import fs from 'fs';

const parser = new Parser();

async function repurposeHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const { url, type } = await req.json(); // type: 'youtube' | 'podcast'

    if (!url) {
      return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'URL is required' }, { status: 400 });
    }

    // 1. Initial Job Creation
    const { data: jobData, error: jobError } = await supabase
      .from('repurpose_jobs')
      .insert({
        user_id: user.id,
        source_url: url,
        source_type: type || (url.includes('youtube') ? 'youtube' : 'podcast'),
        status: 'processing'
      })
      .select()
      .single();

    if (jobError || !jobData) {
      throw jobError || new Error('Failed to create job');
    }

    const job = jobData as RepurposeJob;

    // Deduct Credits (20 credits)
    await deductCredits();

    // Perform transcription and metadata extraction
    let transcript = "";
    // metadata is assigned but unused in current version - removing to satisfy TS6133
    // let metadata:any = {};
    const audioPath = `/tmp/${job.id}.mp3`;

    if (job.source_type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const info = await ytdl.getInfo(url);
      /*
      metadata = {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        thumbnail: info.videoDetails.thumbnails[0]?.url,
        duration: info.videoDetails.lengthSeconds
      };
      */
      
      // 1. Download audio track only
      await new Promise<void>((resolve, reject) => {
          ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
              .pipe(fs.createWriteStream(audioPath))
              .on('finish', () => resolve())
              .on('error', (err: Error) => reject(err));
      });

      transcript = `Video Title: ${info.videoDetails.title}. Description: ${info.videoDetails.description}`;
    } else {
      const feed = await parser.parseURL(url);
      const episode = feed.items[0]; 
      /*
      metadata = {
        title: episode.title,
        author: feed.title,
        thumbnail: episode.itunes?.image || feed.image?.url,
        duration: episode.itunes?.duration
      };
      */
      transcript = episode.contentSnippet || episode.content || "";
    }

    const prompt = `
You are a master content repurposer. Based on this transcript/metadata, generate:
1. 3 High-impact LinkedIn posts (different angles: educational, controversial, personal story).
2. 5 Viral Twitter/X threads (max 4 tweets per thread).
3. 2 Newsletters summaries.

Source details:
${transcript}

Return ONLY a valid JSON object:
{
  "linkedin": ["post1", "post2", "post3"],
  "twitter": [ ["t1_1", "t1_2"], ["t2_1", "t2_2"] ],
  "newsletter": ["n1", "n2"]
}
    `;

    const text = await generateText({
      routeType: 'repurpose',
      prompt,
      jsonMode: true,
    });
    
    let jsonString = text;
    if (text.includes('```json')) {
      jsonString = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonString = text.split('```')[1].split('```')[0].trim();
    }

    const outputContent = JSON.parse(jsonString);

    // Update job with results
    const { data: updatedJob } = await supabase
      .from('repurpose_jobs')
      .update({
        status: 'complete',
        outputs: outputContent,
        credits_used: 20
      })
      .eq('id', job.id)
      .select()
      .single();

    return NextResponse.json({ success: true, data: updatedJob as RepurposeJob }, { status: 200 });

  } catch (error:any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ message: 'repurpose failed', data: { userId: user.id, error: errorMessage } });
    return NextResponse.json({ success: false, code: 'REPURPOSE_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(repurposeHandler, {
  requireCredits: 20,
  actionName: 'content-repurpose'
});
