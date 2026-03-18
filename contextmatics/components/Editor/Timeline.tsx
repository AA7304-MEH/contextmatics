import { useRef, useEffect } from 'react';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { Clock, ZoomIn, ZoomOut, Scissors, Trash2 } from 'lucide-react';

import { TimelineTrack } from './TimelineTrack';

export const Timeline: React.FC = () => {
    const { 
        tracks, 
        duration, 
        currentTime, 
        isPlaying,
        zoom,
        selectedClipId,
        setCurrentTime, 
        setIsPlaying,
        setZoom,
        splitClip,
        removeClip
    } = useTimelineStore();

    const timelineRef = useRef<HTMLDivElement>(null);
    const PIXELS_PER_SECOND = 20 * zoom;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 's' || e.key === 'S') {
                if (selectedClipId) splitClip(selectedClipId, currentTime);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                if (selectedClipId) removeClip(selectedClipId);
            } else if (e.key === ' ') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedClipId, currentTime, isPlaying, splitClip, removeClip, setIsPlaying]);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        const time = x / PIXELS_PER_SECOND;
        setCurrentTime(time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    return (
        <div className="flex flex-col bg-zinc-950 border-t border-white/10 h-80">
            {/* Timeline Toolbar */}
            <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Clock size={12} />
                        <span className="font-mono text-white text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => selectedClipId && splitClip(selectedClipId, currentTime)}
                            disabled={!selectedClipId}
                            className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 transition-colors"
                            title="Split Clip (S)"
                        >
                            <Scissors size={14} />
                        </button>
                        <button 
                            onClick={() => selectedClipId && removeClip(selectedClipId)}
                            disabled={!selectedClipId}
                            className="p-1.5 rounded hover:bg-white/5 text-red-400/70 hover:text-red-400 disabled:opacity-30 transition-colors"
                            title="Delete Clip (Del)"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 rounded-lg border border-white/10 p-0.5">
                        <button onClick={() => setZoom(zoom / 1.2)} className="p-1 hover:text-white transition-colors border-r border-white/5"><ZoomOut size={14} /></button>
                        <button onClick={() => setZoom(zoom * 1.2)} className="p-1 hover:text-white transition-colors"><ZoomIn size={14} /></button>
                    </div>
                </div>
            </div>

            {/* Timeline Area */}
            <div 
                ref={timelineRef}
                className="flex-1 overflow-x-auto overflow-y-auto relative no-scrollbar"
                onClick={handleTimelineClick}
            >
                <div 
                    className="relative min-h-full" 
                    style={{ width: `${duration * PIXELS_PER_SECOND}px` }}
                >
                    {/* Time Ruler */}
                    <div className="h-6 border-b border-white/5 flex items-end">
                        {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute border-l border-white/20 h-2" 
                                style={{ left: `${i * PIXELS_PER_SECOND}px` }}
                            >
                                {i % 5 === 0 && (
                                    <span className="absolute -top-4 left-1 text-[8px] text-zinc-600 font-mono">{i}s</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tracks */}
                    <div className="flex flex-col pt-2">
                        {tracks.map((track) => (
                            <TimelineTrack 
                                key={track.id} 
                                track={track} 
                                pixelsPerSecond={PIXELS_PER_SECOND} 
                            />
                        ))}
                    </div>

                    {/* Playhead */}
                    <div 
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-50 pointer-events-none"
                        style={{ left: `${currentTime * PIXELS_PER_SECOND}px` }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 clip-playhead" />
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .clip-playhead {
                    clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};
