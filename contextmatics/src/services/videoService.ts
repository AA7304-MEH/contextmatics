import { supabase } from '../lib/supabaseClient';
import { Video } from '../types';

// Safe placeholder check (supabaseUrl is protected on SupabaseClient)
const isPlaceholder = () => (supabase as any).supabaseUrl?.includes('placeholder');

export interface VideoGenerationParams {
    prompt: string;
    style: string;
    snippetId?: string;
    userId: string;
    platform: 'tiktok' | 'reels' | 'shorts';
}

export interface VideoGenerationResult {
    jobId: string;
    videoUrl?: string; // Optional because initial creation doesn't have it
    thumbnailUrl?: string;
    audioUrl?: string;
    status: 'pending' | 'completed' | 'failed';
    duration?: number;
}

// Mock delay function for simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Placeholder assets (Using highly reliable Cloudinary samples)
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

// Reliable Public Domain Audio (Upbeat/Tech)
const PLACEHOLDER_AUDIO = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=upbeat-future-bass-112776.mp3"; // Example Royalty Free


export const videoService = {
    /**
     * Checks if user has enough credits
     */
    /**
     * Checks if user has enough credits
     */
    checkCredits: async (userId: string): Promise<number> => {
        // Mock Bypass
        if (isPlaceholder()) {
            const authSession = localStorage.getItem('auth_session');
            if (authSession) {
                const user = JSON.parse(authSession);
                return user.processingCredits || 0;
            }
            return 10;
        }

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
        // Mock Bypass
        if (isPlaceholder()) {
            const authSession = localStorage.getItem('auth_session');
            if (authSession) {
                const user = JSON.parse(authSession);
                if (user.processingCredits <= 0) throw new Error("Insufficient credits");
                user.processingCredits -= 1;
                localStorage.setItem('auth_session', JSON.stringify(user));
                return;
            }
            return;
        }

        // First get current credits
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!profile || profile.credits_remaining <= 0) throw new Error("Insufficient credits");

        // Decrement
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits_remaining: profile.credits_remaining - 1 })
            .eq('id', userId);

        if (updateError) throw updateError;
    },

    /**
     * Creates a video generation job
     */
    generateVideo: async (params: VideoGenerationParams): Promise<VideoGenerationResult> => {
        console.log('[VideoService] Starting generation for:', params);

        // 1. Check & Deduct Credits
        await videoService.deductCredit(params.userId);

        // Mock Bypass
        if (isPlaceholder()) {
            await delay(1000); // Simulate network
            const mockJobId = 'mock-job-' + Date.now();

            // Trigger simulation in background
            setTimeout(() => {
                // In a real app with local mock, we'd update a local store.
                // For now, we just let the UI know it's "pending" and the user can check "My Generations" which we can verify later.
                console.debug('[Demo] Video generation completed for', mockJobId);

                // Smart Mock Selection
                const lowerPrompt = params.prompt.toLowerCase();
                let selectedVideo = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/cld-sample-video.mp4";
                let selectedThumb = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/cld-sample-video.jpg";

                if (lowerPrompt.includes('tech') || lowerPrompt.includes('future') || lowerPrompt.includes('cyber') || lowerPrompt.includes('ai')) {
                    selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
                    selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg";
                } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('nature') || lowerPrompt.includes('rabbit')) {
                    selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";
                } else if (lowerPrompt.includes('sea') || lowerPrompt.includes('ocean')) {
                    selectedVideo = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.mp4";
                    selectedThumb = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.jpg";
                }

                // We could also emit an event or update a local storage "videos" list
                const cleanVideos = JSON.parse(localStorage.getItem('mock_videos') || '[]');

                const newVideo = {
                    id: mockJobId,
                    user_id: params.userId,
                    prompt: params.prompt,
                    style: params.style,
                    platform: params.platform,
                    status: 'completed',
                    created_at: new Date().toISOString(),
                    url: selectedVideo,
                    thumbnail_url: selectedThumb,
                    audio_url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=upbeat-future-bass-112776.mp3"
                };
                localStorage.setItem('mock_videos', JSON.stringify([newVideo, ...cleanVideos]));
            }, 2500);

            return {
                jobId: mockJobId,
                status: 'pending'
            };
        }

        // 2. Insert "Pending" Job
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

        // 3. Simulate Processing (Client-side for now)
        videoService.simulateProcessing(job.id, params.prompt);

        return {
            jobId: job.id,
            status: 'pending'
        };
    },

    /**
     * Simulates the AI processing delay and update with Keyword Matching
     */
    simulateProcessing: async (jobId: string, prompt: string) => {
        await delay(2500); // 2.5s delay

        // Smart Mock: Select video based on prompt keywords
        const lowerPrompt = prompt.toLowerCase();
        let selectedVideo = PLACEHOLDER_VIDEOS[0]; // Default
        let selectedThumb = PLACEHOLDER_THUMBS[0];

        // Keyword Matcher for "Free High-Quality" simulation
        if (lowerPrompt.includes('tech') || lowerPrompt.includes('future') || lowerPrompt.includes('cyber') || lowerPrompt.includes('ai')) {
            // Tech / Future -> Use "Elephants Dream" (Sci-fi vibe) or similar
            selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
            selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg";
        } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('nature') || lowerPrompt.includes('rabbit') || lowerPrompt.includes('bunny')) {
            selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";
        } else if (lowerPrompt.includes('fire') || lowerPrompt.includes('action') || lowerPrompt.includes('fast')) {
            selectedVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
            selectedThumb = "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg";
        } else if (lowerPrompt.includes('water') || lowerPrompt.includes('sea') || lowerPrompt.includes('ocean')) {
            selectedVideo = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.mp4";
            selectedThumb = "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.jpg";
        } else {
            // Random fallback from Cloudinary
            const cldVideos = [
                "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.mp4",
                "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/elephants.mp4",
                "https://res.cloudinary.com/demo/video/upload/v1690989016/samples/cld-sample-video.mp4"
            ];
            selectedVideo = cldVideos[Math.floor(Math.random() * cldVideos.length)];
            selectedThumb = selectedVideo.replace('.mp4', '.jpg');
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
        // Mock Bypass
        if (isPlaceholder()) {
            const mockVideosRaw = JSON.parse(localStorage.getItem('mock_videos') || '[]');

            // FILTER: Keep only Cloudinary videos, filter out old Google/Mixkit ones
            const cleanVideos = mockVideosRaw.filter((v: any) =>
                v.url &&
                v.url.includes('cloudinary.com')
            );

            // Update storage if we filtered anything
            if (cleanVideos.length !== mockVideosRaw.length) {
                localStorage.setItem('mock_videos', JSON.stringify(cleanVideos));
                console.log("🧹 Cleaned up non-Cloudinary mock videos");
            }

            return cleanVideos as Video[];
        }

        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Video[];
    }
};
