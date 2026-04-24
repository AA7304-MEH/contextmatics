import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { transcribeAudio } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { RepurposeJob } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function youtubeRepurposeHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/repurpose/youtube';
    
    try {
        const { url, type = 'youtube', resumeJobId } = await req.json();

        if (!url && !resumeJobId) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'URL or jobId is required' }, { status: 400 });
        }

        let job: RepurposeJob;
        if (resumeJobId) {
            const { data, error } = await supabase.from('repurpose_jobs').select('*').eq('id', resumeJobId).single();
            if (error || !data) return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Job not found' }, { status: 404 });
            job = data as RepurposeJob;
        } else {
            const { data, error } = await supabase
                .from('repurpose_jobs')
                .insert({
                    user_id: user.id,
                    source_url: url,
                    source_type: type,
                    status: 'processing'
                })
                .select()
                .single();
            if (error || !data) throw error || new Error('Failed to create job');
            job = data as RepurposeJob;
        }

        // Background processing
        processVideo(job.source_url || '', job.id, user.id, supabase, deductCredits, (job as any).last_processed_chunk_index || -1).catch((err) => {
            logger.error(`[Background Task] ${route}`, { jobId: job.id, error: err.message });
        });

        return NextResponse.json({ 
            success: true, 
            data: {
                jobId: job.id, 
                message: resumeJobId ? 'Resuming processing' : 'Processing started' 
            }
        }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Repurpose initiation failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'INITIATION_FAILED', message: errorMessage }, { status: 500 });
    }
}

async function processVideo(url: string, jobId: string, userId: string, supabase: SupabaseClient, deductCredits: () => Promise<void>, lastProcessedIndex: number = -1) {
    const tempDir = path.join(os.tmpdir(), `repurpose-${jobId}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const audioPath = path.join(tempDir, 'audio.mp3');
    
    try {
        // 1. Download audio track only
        await new Promise<void>((resolve, reject) => {
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
                .pipe(fs.createWriteStream(audioPath))
                .on('finish', () => resolve())
                .on('error', (err) => reject(err));
        });

        // 2. Get total duration
        const duration: number = await new Promise<number>((resolve, reject) => {
            ffmpeg.ffprobe(audioPath, (err:any, metadata:any) => {
                if (err) reject(err);
                resolve(metadata.format?.duration || 0);
            });
        });

        let finalTranscript = '';
        const chunkDuration = 600; // 10 minutes
        const threshold = 1500; // 25 minutes

        if (duration > threshold) {
            const numChunks = Math.ceil(duration / chunkDuration);
            const chunksDir = path.join(tempDir, 'chunks');
            if (!fs.existsSync(chunksDir)) fs.mkdirSync(chunksDir);

            // Fetch existing transcript if resuming
            if (lastProcessedIndex >= 0) {
                const { data } = await supabase.from('repurpose_jobs').select('transcript').eq('id', jobId).single();
                finalTranscript = data?.transcript || '';
            }

            for (let i = lastProcessedIndex + 1; i < numChunks; i++) {
                try {
                    const chunkPath = path.join(chunksDir, `chunk-${i}.mp3`);
                    
                    // Extract Chunk
                    await new Promise<void>((resolve, reject) => {
                        ffmpeg(audioPath)
                            .setStartTime(i * chunkDuration)
                            .setDuration(chunkDuration)
                            .output(chunkPath)
                            .on('end', () => resolve())
                            .on('error', (err) => reject(err))
                            .run();
                    });

                    // Transcribe chunk using providers.ts
                    const chunkStream = fs.createReadStream(chunkPath);
                    const transcribedText = await transcribeAudio(chunkStream as any);
                    
                    const chunkText = `[CHUNK ${i + 1}]\n${transcribedText}\n`;
                    finalTranscript += chunkText;

                    // Update job with partial progress
                    await supabase.from('repurpose_jobs').update({
                        last_processed_chunk_index: i,
                        total_chunks: numChunks,
                        transcript: finalTranscript.trim(),
                        status: 'processing'
                    }).eq('id', jobId);

                } catch (chunkErr: unknown) {
                    const msg = chunkErr instanceof Error ? chunkErr.message : 'Chunk failed';
                    // Save progress so far and set status = 'partial'
                    await supabase.from('repurpose_jobs').update({
                        status: 'partial',
                        error_message: `Failed at chunk ${i + 1}: ${msg}`
                    }).eq('id', jobId);
                    throw chunkErr; 
                }
            }
        } else {
            // Transcribe full file using providers.ts
            const fullStream = fs.createReadStream(audioPath);
            finalTranscript = await transcribeAudio(fullStream as any);
        }

        // 3. Finalize Job & Deduct Credits
        await deductCredits();
        
        await supabase.from('repurpose_jobs').update({
            status: 'complete',
            transcript: finalTranscript.trim(),
            credits_used: 3,
            updated_at: new Date().toISOString()
        }).eq('id', jobId);

        logger.info('Repurposing job completed successfully', { jobId, userId });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Background repurpose process failed', { jobId, userId, error: msg });
    } finally {
        // Cleanup
        try {
            if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e: unknown) {
            // Cleanup failed silently
        }
    }
}

export const POST = withAuthAndCredits(youtubeRepurposeHandler, {
    requirePlan: 'pro',
    requireCredits: 5,
    rateLimit: 3,
    rateLimitWindow: '3600 s',
    actionName: 'Repurpose YouTube/Podcast'
});
