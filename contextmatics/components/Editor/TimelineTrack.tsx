"use client";

import React from 'react';
import { useDrop } from 'react-dnd';
import { Track } from '@/types';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { DraggableClip } from './DraggableClip';

interface TimelineTrackProps {
    track: Track;
    pixelsPerSecond: number;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ track, pixelsPerSecond }) => {
    const { clips, moveClip } = useTimelineStore();
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'CLIP',
        drop: (item: { id: string, startTime: number, trackId: string }, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            if (!delta) return;
            
            const newStartTime = item.startTime + (delta.x / pixelsPerSecond);
            moveClip(item.id, newStartTime, track.id);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [pixelsPerSecond, track.id]);

    const trackClips = clips.filter(c => c.trackId === track.id);

    return (
        <div 
            ref={drop as any}
            className={`h-16 border-b border-white/5 relative group transition-colors ${
                isOver ? 'bg-white/5' : ''
            }`}
        >
            {/* Track Info Overlay (visible on hover) */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-zinc-900/80 border-r border-white/10 z-20 px-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-zinc-400 uppercase truncate">{track.name}</span>
            </div>

            {/* Clips in this track */}
            {trackClips.map(clip => (
                <DraggableClip 
                    key={clip.id} 
                    clip={clip} 
                    pixelsPerSecond={pixelsPerSecond} 
                />
            ))}
        </div>
    );
};
