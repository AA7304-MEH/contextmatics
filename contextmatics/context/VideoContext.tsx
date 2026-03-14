"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Video } from '@/types';

interface VideoContextType {
    videos: Video[];
    generateVideo: (params: { prompt: string; style: string; platform: string; snippetId?: string }) => Promise<string>;
    refreshVideos: () => Promise<void>;
    loading: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchVideos = async () => {
        if (!user) {
            setVideos([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/video');
            if (!response.ok) throw new Error('Failed to fetch videos');
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [user]);

    const generateVideo = async (params: { prompt: string; style: string; platform: string; snippetId?: string }) => {
        try {
            const response = await fetch('/api/video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });

            if (!response.ok) throw new Error('Failed to generate video');
            const data = await response.json();

            // Refresh list to show pending
            await fetchVideos();
            return data.jobId;
        } catch (error) {
            console.error('Error generating video:', error);
            throw error;
        }
    };

    return (
        <VideoContext.Provider value={{ videos, generateVideo, refreshVideos: fetchVideos, loading }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideo = () => {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
};
