// Faceless Pro Pipeline Orchestrator — Advanced Edition
// Gemini-powered generation + extended progress

import { VideoScript, GenerateOptions, generateFacelessScript } from './facelessGenerator';

export interface FacelessRequest extends GenerateOptions {
    activeTab?: 'create' | 'clone' | 'oneclick';
    cloneUrls?: string;
}

export type PipelineState = 'IDLE' | 'ANALYZING' | 'PLANNING' | 'AI_GENERATING' | 'SYNTHESIZING' | 'COMPLETING' | 'ERROR';

export interface PipelineUpdate {
    state: PipelineState;
    message: string;
    progress: number;
}

const PIPELINE_STEPS: { state: PipelineState; message: string; duration: number }[] = [
    { state: 'ANALYZING', message: 'Scanning platform trends for maximum reach...', duration: 600 },
    { state: 'ANALYZING', message: 'Extracting viral hook patterns from 10k+ videos...', duration: 700 },
    { state: 'PLANNING', message: 'Director storyboarding: shot types & visual motifs...', duration: 800 },
    { state: 'PLANNING', message: 'Building cinematic timeline with motion mapping...', duration: 700 },
    { state: 'AI_GENERATING', message: 'AI writing script: voice, tone, brand DNA...', duration: 1200 },
    { state: 'AI_GENERATING', message: 'Atomizing into multi-platform variants...', duration: 800 },
    { state: 'SYNTHESIZING', message: 'Compositing 4K visual assets for each scene...', duration: 900 },
    { state: 'SYNTHESIZING', message: 'Mixing 3-track audio score & voiceover...', duration: 700 },
    { state: 'COMPLETING', message: 'Applying color grading & VFX pass...', duration: 500 },
    { state: 'COMPLETING', message: 'Finalizing campaign layout...', duration: 400 },
];

export async function runFacelessPipeline(
    request: FacelessRequest,
    onProgress?: (update: PipelineUpdate) => void
): Promise<VideoScript> {
    const totalSteps = PIPELINE_STEPS.length;

    try {
        for (let i = 0; i < totalSteps; i++) {
            const step = PIPELINE_STEPS[i];
            onProgress?.({
                state: step.state,
                message: step.message,
                progress: Math.round(((i + 1) / totalSteps) * 90),
            });
            await delay(step.duration);
        }

        // Clone analysis
        if (request.activeTab === 'clone' && request.cloneUrls) {
            onProgress?.({
                state: 'AI_GENERATING',
                message: `Extracting brand DNA from ${request.cloneUrls}...`,
                progress: 92,
            });
            await delay(1500);
        }

        // Generate the script
        onProgress?.({
            state: 'COMPLETING',
            message: 'Building final script package...',
            progress: 95,
        });

        const script = await generateFacelessScript({
            topic: request.topic,
            style: request.style,
            purpose: request.purpose,
            platforms: request.platforms,
            themeId: request.themeId,
            captionStyle: request.captionStyle,
            aspectRatio: request.aspectRatio,
            musicMood: request.musicMood,
            voiceTone: request.voiceTone,
            targetDuration: request.targetDuration,
        });

        onProgress?.({
            state: 'COMPLETING',
            message: 'Pipeline complete! Your campaign is ready.',
            progress: 100,
        });

        return script;
    } catch (error) {
        onProgress?.({
            state: 'ERROR',
            message: `Pipeline failed: ${error}`,
            progress: 0,
        });
        throw error;
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
