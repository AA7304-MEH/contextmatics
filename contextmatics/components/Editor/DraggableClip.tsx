"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { Clip } from '@/types';
import { useTimelineStore } from '@/stores/useTimelineStore';

interface DraggableClipProps {
    clip: Clip;
    pixelsPerSecond: number;
}

export const DraggableClip: React.FC<DraggableClipProps> = ({ clip, pixelsPerSecond }) => {
    const { selectedClipId, setSelectedClipId } = useTimelineStore();
    
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CLIP',
        item: { id: clip.id, startTime: clip.startTime, trackId: clip.trackId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [clip]);

    const handleTrimStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Implement trim start logic: adjust startTime and duration
        console.log("Trim start");
    };

    const handleTrimEnd = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Implement trim end logic: adjust duration
        console.log("Trim end");
    };

    return (
        <div
            ref={drag as any}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedClipId(clip.id);
            }}
            style={{
                left: `${clip.startTime * pixelsPerSecond}px`,
                width: `${clip.duration * pixelsPerSecond}px`,
                opacity: isDragging ? 0.5 : 1,
            }}
            className={`absolute inset-y-2 rounded-xl border flex items-center px-4 cursor-move transition-all group/clip ${
                selectedClipId === clip.id 
                    ? 'ring-2 ring-white border-white shadow-lg shadow-white/10 z-30' 
                    : 'border-white/10 hover:border-white/30 z-10'
            } ${
                clip.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                clip.type === 'audio' ? 'bg-indigo-500/20 text-indigo-400' :
                clip.type === 'image' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-purple-500/20 text-purple-400'
            }`}
        >
            {/* Left Trim Handle */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 opacity-0 group-hover/clip:opacity-100 transition-opacity rounded-l-xl"
                onMouseDown={handleTrimStart}
            />

            <div className="flex flex-col min-w-0 select-none">
                <span className="text-[10px] font-bold uppercase truncate">{clip.name}</span>
                <span className="text-[8px] opacity-60 font-mono">{(clip.duration).toFixed(1)}s</span>
            </div>

            {/* Right Trim Handle */}
            <div 
                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/30 opacity-0 group-hover/clip:opacity-100 transition-opacity rounded-r-xl"
                onMouseDown={handleTrimEnd}
            />
        </div>
    );
};
