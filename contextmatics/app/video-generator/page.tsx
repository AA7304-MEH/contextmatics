"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/shared/PageLayout';
import { videoService, VideoGenerationResult } from '@/services/videoService';
import { VideoPreviewEditor } from '@/components/video-generator/VideoPreviewEditor';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Video } from '@/types';

import { VerifiedProtection } from '@/components/VerifiedProtection';

export default function VideoGeneratorPage() {
    return (
        <VerifiedProtection>
            <VideoGeneratorContent />
        </VerifiedProtection>
    );
}

function VideoGeneratorContent() {
    const { user, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('reel');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<VideoGenerationResult | null>(null);
    const [myVideos, setMyVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    // Fetch user's video history
    useEffect(() => {
        if (user) {
            videoService.getUserVideos(user.id).then(setMyVideos).catch(console.error);
        }
    }, [user, result]);

    const handleGenerate = async () => {
        if (!prompt.trim() || !user) return;

        if (user.processingCredits <= 0) {
            showToast('Insufficient credits! Please upgrade your plan.', 'error');
            router.push('/pricing');
            return;
        }

        setIsGenerating(true);
        try {
            let mappedPlatform: 'tiktok' | 'reels' | 'shorts' = 'reels';
            if (style === 'tiktok') mappedPlatform = 'tiktok';
            if (style === 'shorts') mappedPlatform = 'shorts';

            const data = await videoService.generateVideo({
                prompt,
                style,
                userId: user.id,
                platform: mappedPlatform
            });
            
            if (data.projectId) {
                showToast('Video project generated! Redirecting to studio...', 'success');
                router.push(`/studio/${data.projectId}`);
            } else {
                setResult(data);
                await refreshProfile();
            }
        } catch (error:any) {
            console.error("Generation failed", error);
            showToast(error.message || 'Failed to generate video. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setSelectedVideo(null);
        setPrompt('');
    };

    const handleSelectVideo = (video: Video) => {
        if (!video.url) return;
        setSelectedVideo(video);
        setResult({
            jobId: video.id,
            videoUrl: video.url,
            thumbnailUrl: video.thumbnail_url || '',
            audioUrl: video.audio_url,
            status: video.status as 'completed' | 'failed' | 'pending',
            duration: 15
        });
    };

    const activeVideoUrl = selectedVideo?.url || result?.videoUrl;
    const activeAudioUrl = selectedVideo?.audio_url || result?.audioUrl;

    return (
        <PageLayout>
            <div className="flex h-[calc(100vh-80px)] text-left">
                {/* Sidebar: My Generations */}
                <div className="w-80 border-r border-white/5 bg-black/20 hidden lg:flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Generations</h2>
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{myVideos.length} videos</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {myVideos.map(video => (
                            <div
                                key={video.id}
                                onClick={() => handleSelectVideo(video)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/5 ${selectedVideo?.id === video.id ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 bg-black/40'}`}
                            >
                                <div className="flex gap-3">
                                    <div className="w-16 h-24 bg-black/50 rounded flex-shrink-0 overflow-hidden relative">
                                        {video.thumbnail_url ? (
                                            <img src={video.thumbnail_url} className="w-full h-full object-cover" alt="Thumb" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-white/20">
                                                {video.status === 'pending' ? '⏳' : '🎬'}
                                            </div>
                                        )}
                                        {video.status === 'pending' && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <p className="text-sm text-white font-medium truncate mb-1" title={video.prompt}>{video.prompt}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${video.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {video.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Turn text into viral video.</h1>
                            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-lg text-center">
                                Describe your idea, allowing our AI to generate a script, visuals, and voiceover in seconds.
                            </p>
                        </div>

                        {!activeVideoUrl && !isGenerating && !result ? (
                            <div className="card p-1 border border-[var(--color-border-subtle)] bg-black/40 backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative bg-[var(--color-bg-primary)] rounded-xl p-6 sm:p-10">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Video Prompt</label>
                                            <textarea
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="E.g., Create a 30-second motivational Reel for founders about perseverance..."
                                                className="input w-full min-h-[150px] text-base resize-none p-4 leading-relaxed"
                                                disabled={isGenerating}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Style & Format</label>
                                                <select value={style} onChange={(e) => setStyle(e.target.value)} className="input w-full h-12" disabled={isGenerating}>
                                                    <option value="reel">📱 Instagram Reel (9:16)</option>
                                                    <option value="tiktok">🎵 TikTok Trend (9:16)</option>
                                                    <option value="shorts">▶️ YouTube Short (9:16)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Credits</label>
                                                <div className="input w-full h-12 flex items-center px-4 font-mono font-bold text-green-400">
                                                    {user?.processingCredits || 0} Credits
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || !user || user.processingCredits < 10} className="btn btn--primary w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-none">
                                            {isGenerating ? 'Dreaming up your video...' : 'Generate Video (10 Credits)'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6">Details</h3>
                                    <div className="card p-6 border border-[var(--color-border-subtle)] space-y-4 mb-6">
                                        <div>
                                            <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-bold">Prompt</span>
                                            <p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">"{selectedVideo?.prompt || prompt}"</p>
                                        </div>
                                    </div>
                                    <button onClick={handleReset} className="btn btn-secondary w-full">Create New Video</button>
                                </div>
                                <div>
                                    {activeVideoUrl ? (
                                        <VideoPreviewEditor videoUrl={activeVideoUrl} audioUrl={activeAudioUrl} onReset={handleReset} />
                                    ) : (
                                        <div className="aspect-[9/16] bg-black/50 border border-white/10 rounded-xl flex items-center justify-center flex-col gap-4">
                                            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                            <p className="text-sm text-white/70">Processing your video...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
