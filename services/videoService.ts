import { supabase } from '../lib/supabaseClient';
import { Video } from '../types';

export interface VideoGenerationParams {
    prompt: string;
    style: string;
    snippetId?: string;
    userId: string;
    platform: 'tiktok' | 'reels' | 'shorts';
}

export interface VideoGenerationResult {
    jobId: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    audioUrl?: string;
    status: 'pending' | 'completed' | 'failed';
    duration?: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const PLACEHOLDER_VIDEOS = [
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.mp4",
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/elephants.mp4",
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/cld-sample-video.mp4"
];

const PLACEHOLDER_THUMBS = [
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.jpg",
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/elephants.jpg",
    "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/cld-sample-video.jpg"
];

const PLACEHOLDER_AUDIO = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=upbeat-future-bass-112776.mp3";


export const videoService = {
    /**
     * Checks if user has enough credits
     */
    checkCredits: async (userId: string): Promise<number> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data?.credits_remaining || 0;
    },

    /**
     * Deducts 1 credit from user
     */
    deductCredit: async (userId: string) => {
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!profile || profile.credits_remaining <= 0) throw new Error("Insufficient credits");

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits_remaining: profile.credits_remaining - 1 })
            .eq('id', userId);

        if (updateError) throw updateError;
    },

    /**
     * Creates a video generation job record
     */
    generateVideo: async (params: VideoGenerationParams): Promise<VideoGenerationResult> => {
        console.log('[VideoService] Starting generation for:', params);

        const { data: job, error: insertError } = await supabase
            .from('videos')
            .insert({
                user_id: params.userId,
                prompt: params.prompt,
                style: params.style,
                platform: params.platform,
                status: 'pending',
                snippet_id: params.snippetId
            })
            .select()
            .single();

        if (insertError) throw insertError;

        // In a production app, we would not simulate this client-side.
        // We'd rely on a background worker. Keeping it for now for demo purposes.
        videoService.simulateProcessing(job.id, params.prompt);

        return {
            jobId: job.id,
            status: 'pending'
        };
    },

    /**
     * Simulates the AI processing delay and update
     * @note In production, this should be handled by a background worker/webhooks.
     */
    simulateProcessing: async (jobId: string, prompt: string) => {
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK_VIDEO === 'true' || process.env.NODE_ENV === 'development';

        if (!useMock) {
            console.log('[VideoService] Mock simulation skipped. Waiting for real AI worker update.');
            return;
        }

        await delay(5000);

        const lowerPrompt = prompt.toLowerCase();
        let selectedVideo = PLACEHOLDER_VIDEOS[0];
        let selectedThumb = PLACEHOLDER_THUMBS[0];

        if (lowerPrompt.includes('tech') || lowerPrompt.includes('future') || lowerPrompt.includes('ai')) {
            selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
            selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg";
        } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('nature')) {
            selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";
        }

        const { error } = await supabase
            .from('videos')
            .update({
                status: 'completed',
                url: selectedVideo,
                thumbnail_url: selectedThumb,
                audio_url: PLACEHOLDER_AUDIO
            })
            .eq('id', jobId);

        if (error) console.error("Failed to update simulated job", error);
    },

    /**
     * Fetch user's video history
     */
    getUserVideos: async (userId: string): Promise<Video[]> => {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Video[];
    }
};
