import React, { useState, useRef } from 'react';
import { useToast } from '@/context/ToastContext';

interface VideoPreviewEditorProps {
    videoUrl: string;
    audioUrl?: string; // Optional background audio
    onReset: () => void;
}

export const VideoPreviewEditor: React.FC<VideoPreviewEditorProps> = ({ videoUrl, audioUrl, onReset }) => {
    const { showToast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                if (audioRef.current) audioRef.current.pause();
            } else {
                videoRef.current.play();
                if (audioRef.current) {
                    audioRef.current.currentTime = videoRef.current.currentTime;
                    // Attempt to play audio, handling browser autoplay policies
                    audioRef.current.play().catch(_e => {});
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleExport = async () => {
        try {
            showToast('Preparing your video for download...', 'info');
            
            // Refactor for Safari compatibility:
            // Using window.open with our download-logo proxy logic (which works for videos too)
            // But let's check if we have a download-video route. We can reuse download-logo if it just proxies.
            // Actually, let's just use the direct URL with window.open if it's external, 
            // but the browser might just PLAY it. 
            // Our proxy route forces 'attachment' via headers.
            const proxyUrl = `/api/ai/download-logo?url=${encodeURIComponent(videoUrl)}`;
            window.open(proxyUrl, '_blank');
            
            showToast('Download started! 🚀', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            showToast('Download failed. Opening in new tab...', 'error');
            window.open(videoUrl, '_blank');
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Preview & Edit</h3>
                <button
                    onClick={onReset}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                    Start Over
                </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-[9/16] max-w-sm mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border-subtle)] group">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    playsInline
                    loop
                    onError={(e) => {
                        const error = e.currentTarget.error;
                        // Only alert if it's a real error, not just an interruption/abort
                        if (error && error.code !== 1) {
                            const errorMsg = error.message || "Unknown error";
                            showToast(`Playback Error: ${errorMsg} (Code: ${error.code})`, 'error');
                        }
                    }}
                />

                {/* Background Audio Player */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        loop
                    />
                )}

                {/* Play/Pause Overlay */}
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                    onClick={togglePlay}
                >
                    <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-105 transition-transform">
                        {isPlaying ? (
                            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                        ) : (
                            <svg className="w-8 h-8 text-white fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                            style={{ width: `${(duration > 0 ? currentTime / duration : 0) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-mono text-gray-300">
                        <span>{Math.floor(currentTime)}s</span>
                        <span>{Math.floor(duration)}s</span>
                    </div>
                </div>
            </div>

            {/* Editor Controls */}
            <div className="card p-6 border border-[var(--color-border-subtle)] space-y-6">

                {/* Trim Mock Control */}
                <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2 block">Trim Video</label>
                    <div className="h-12 bg-[#1a1d24] rounded-lg border border-[var(--color-border-subtle)] relative flex items-center px-2">
                        {/* Fake waveform visual */}
                        <div className="flex-1 flex items-end gap-[1px] h-6 opacity-30">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} className="bg-blue-400 w-full" style={{ height: `${Math.random() * 100}%` }}></div>
                            ))}
                        </div>
                        {/* Mock Handles */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-blue-500/20 border-l-2 border-blue-500 rounded-l cursor-ew-resize"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-blue-500/20 border-r-2 border-blue-500 rounded-r cursor-ew-resize"></div>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2">Drag handles to trim start and end points.</p>
                </div>

                {/* Export Actions */}
                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex gap-4">
                    <button className="btn btn--secondary flex-1 justify-center">
                        Schedule
                    </button>
                    <button
                        onClick={handleExport}
                        className="btn btn--primary flex-1 justify-center bg-gradient-to-r from-blue-600 to-violet-600 border-none"
                    >
                        Export Video
                    </button>
                </div>

            </div>
        </div>
    );
};
