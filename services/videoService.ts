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

    generateVideo: async (params: VideoGenerationParams): Promise<any> => {
        const response = await fetch('/api/video/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to generate video');
        }

        return await response.json();
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
    },

    /**
     * Suggests a template based on snippet content
     */
    suggestTemplate: async (text: string): Promise<string | null> => {
        const lowerText = text.toLowerCase();
        const { data: templates, error } = await supabase
            .from('templates')
            .select('id, name, category');

        if (error || !templates) return null;

        // Simple keyword matching for suggestive templates
        if (lowerText.includes('education') || lowerText.includes('learn') || lowerText.includes('how to')) {
            return templates.find(t => t.category === 'Educational')?.id || templates[0].id;
        }
        if (lowerText.includes('sale') || lowerText.includes('offer') || lowerText.includes('buy')) {
            return templates.find(t => t.category === 'Marketing')?.id || templates[0].id;
        }

        return templates[0].id; // Default to first
    },

    /**
     * Submit user feedback for a video
     */
    submitFeedback: async (videoId: string, userId: string, rating: number, comment: string) => {
        const { error } = await supabase
            .from('video_feedback')
            .insert({
                video_id: videoId,
                user_id: userId,
                rating,
                comment
            });

        if (error) throw error;
    }
};
