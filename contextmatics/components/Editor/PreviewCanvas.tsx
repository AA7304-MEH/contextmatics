"use client";

import React, { useRef, useEffect } from 'react';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';

const VideoClip: React.FC<{ 
    clip:any, 
    currentTime: number, 
    isPlaying: boolean,
    filter: string 
}> = ({ clip, currentTime, isPlaying, filter }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync time
    useEffect(() => {
        if (!videoRef.current) return;
        const targetTime = (currentTime - clip.startTime) + (clip.startOffset || 0);
        
        // Only seek if difference is significant to avoid jitter
        if (Math.abs(videoRef.current.currentTime - targetTime) > 0.2) {
            videoRef.current.currentTime = targetTime;
        }
    }, [currentTime, clip.startTime, clip.startOffset]);

    // Sync play state
    useEffect(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.play().catch(err => console.warn('[VideoClip] Playback blocked:', err));
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <video 
            ref={videoRef}
            src={clip.url}
            className="w-full h-full object-cover"
            style={{ filter }}
            muted={true}
            playsInline
            preload="auto"
            crossOrigin="anonymous"
        />
    );
};

export const PreviewCanvas: React.FC = () => {
    const { 
        currentTime, 
        duration, 
        isPlaying, 
        clips, 
        setCurrentTime, 
        setIsPlaying 
    } = useTimelineStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    // Playback loop
    const animate = (time: number) => {
        if (lastTimeRef.current !== undefined) {
            const deltaTime = (time - lastTimeRef.current) / 1000;
            if (isPlaying) {
                const nextTime = currentTime + deltaTime;
                if (nextTime >= duration) {
                    setCurrentTime(0);
                    setIsPlaying(false);
                } else {
                    setCurrentTime(nextTime);
                }
            }
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, currentTime, duration]);

    // Filter clips that are currently active
    const activeClips = clips.filter(
        clip => currentTime >= clip.startTime && currentTime <= (clip.startTime + clip.duration)
    );

    const getFilterString = (effects:any) => {
        if (!effects) return 'none';
        const { brightness = 100, contrast = 100, blur = 0, grayscale = 0, sepia = 0 } = effects;
        return `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`;
    };

    const getTextStyle = (config:any) => {
        return {
            fontSize: `${config?.fontSize || 32}px`,
            color: config?.color || '#ffffff',
            backgroundColor: config?.backgroundColor || 'transparent',
            textAlign: (config?.textAlign || 'center') as any,
            fontWeight: config?.fontWeight || 'bold',
        };
    };



    const getTransitionStyle = (clip:any) => {
        const { startTime, duration, transitions } = clip;
        if (!transitions) return {};

        let style: React.CSSProperties = { transition: 'none' }; // Disable CSS transitions for manual playback
        const relativeTime = currentTime - startTime;

        // In animation
        if (transitions.in && relativeTime < transitions.in.duration) {
            const progress = Math.max(0, Math.min(1, relativeTime / transitions.in.duration));
            if (transitions.in.type === 'fade') style.opacity = progress;
            if (transitions.in.type === 'slide-left') style.transform = `translateX(${(1 - progress) * 100}%)`;
            if (transitions.in.type === 'zoom-in') style.transform = `scale(${0.8 + progress * 0.2})`;
        }
        
        // Out animation
        const timeRemaining = (startTime + duration) - currentTime;
        if (transitions.out && timeRemaining < transitions.out.duration) {
            const progress = Math.max(0, Math.min(1, timeRemaining / transitions.out.duration));
            const currentOpacity = style.opacity !== undefined ? Number(style.opacity) : 1;
            if (transitions.out.type === 'fade') style.opacity = currentOpacity * progress;
            if (transitions.out.type === 'slide-right') style.transform = `translateX(${(1 - progress) * 100}%)`;
            if (transitions.out.type === 'zoom-out') style.transform = `scale(${1 - (1 - progress) * 0.2})`;
        }

        return style;
    };

    const getActiveVolume = (clip:any) => {
        const { startTime, duration, audioConfig } = clip;
        if (!audioConfig) return 1;

        let volume = (audioConfig.volume ?? 100) / 100;
        const relativeTime = currentTime - startTime;

        if (audioConfig.fadeIn && relativeTime < audioConfig.fadeIn) {
            volume *= (relativeTime / audioConfig.fadeIn);
        }

        const timeRemaining = (startTime + duration) - currentTime;
        if (audioConfig.fadeOut && timeRemaining < audioConfig.fadeOut) {
            volume *= (timeRemaining / audioConfig.fadeOut);
        }

        return Math.max(0, Math.min(1, volume));
    };

    return (
        <div className="flex-1 flex flex-col bg-black relative group">
            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 relative overflow-hidden flex items-center justify-center"
            >
                {/* 9:16 AR Container */}
                <div className="aspect-[9/16] h-[90%] bg-zinc-900 shadow-2xl relative overflow-hidden border border-white/5">
                    {activeClips.length > 0 ? (
                        activeClips.map(clip => (
                            <div 
                                key={clip.id} 
                                className="absolute inset-0 flex items-center justify-center"
                                style={getTransitionStyle(clip)}
                            >
                                {clip.type === 'video' && clip.url && (
                                    <VideoClip 
                                        clip={clip} 
                                        currentTime={currentTime} 
                                        isPlaying={isPlaying} 
                                        filter={getFilterString(clip.effects)}
                                    />
                                )}
                                {clip.type === 'text' && (
                                    <div 
                                        style={getTextStyle(clip.textConfig)}
                                        className="text-center px-4 drop-shadow-lg w-full break-words z-10"
                                    >
                                        {clip.name}
                                    </div>
                                )}
                                {clip.type === 'image' && clip.url && (
                                    <img 
                                        src={clip.url} 
                                        className="w-full h-full object-cover" 
                                        style={{ filter: getFilterString(clip.effects) }}
                                        alt={clip.name}
                                        crossOrigin="anonymous"
                                    />
                                )}
                                {clip.type === 'audio' && clip.url && (
                                    <audio 
                                        src={clip.url}
                                        autoPlay={isPlaying}
                                        onLoadedMetadata={(e) => {
                                            const audio = e.target as HTMLAudioElement;
                                            audio.currentTime = (currentTime - clip.startTime) + clip.startOffset;
                                            audio.volume = getActiveVolume(clip);
                                        }}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-800 font-bold uppercase tracking-widest text-sm">
                            No active clips
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Controls (Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentTime(0)} className="text-zinc-400 hover:text-white transition-colors">
                            <SkipBack size={20} />
                        </button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <SkipForward size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Volume2 size={18} />
                            <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-white" />
                            </div>
                        </div>
                        <button className="text-zinc-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-lg">
                            1080p
                        </button>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
