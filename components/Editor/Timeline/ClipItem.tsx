"use client";

import React, { useState } from 'react';
import { Clip } from '../../../types/editor';
import { useProjectStore } from '../../../stores/projectStore';
import { useDrag } from 'react-dnd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ClipItemProps {
    clip: Clip;
    zoomLevel: number;
}

const ClipItem: React.FC<ClipItemProps> = ({ clip, zoomLevel }) => {
    const {
        selectedClipId,
        setSelectedClipId,
        updateClip,
        removeClip
    } = useProjectStore();

    const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
    const isSelected = selectedClipId === clip.id;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'clip',
        item: { id: clip.id, trackId: clip.trackId, start: clip.start },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [clip.id, clip.trackId, clip.start]);

    const handleMouseDown = (e: React.MouseEvent, side: 'left' | 'right') => {
        e.stopPropagation();
        setIsResizing(side);

        const startX = e.clientX;
        const initialStart = clip.start;
        const initialDuration = clip.duration;

        let currentStart = initialStart;
        let currentDuration = initialDuration;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaTime = deltaX / zoomLevel;

            if (side === 'left') {
                currentStart = Math.max(0, initialStart + deltaTime);
                currentDuration = Math.max(0.1, initialDuration - (currentStart - initialStart));
            } else {
                currentDuration = Math.max(0.1, initialDuration + deltaTime);
            }

            // Update local visual state via CSS if possible, or just update store for now but we'll optimize more if needed.
            // For now, let's keep the store update but we could throttle it.
            updateClip(clip.id, { start: currentStart, duration: currentDuration });
        };

        const onMouseUp = () => {
            setIsResizing(null);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            // Final update to ensure sync
            updateClip(clip.id, { start: currentStart, duration: currentDuration });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('Delete clip?')) {
            removeClip(clip.id);
        }
    };

    const colors = {
        video: 'bg-[#4a90e2]/30 border-[#4a90e2]/50 text-[#4a90e2]',
        audio: 'bg-[#7ed321]/30 border-[#7ed321]/50 text-[#7ed321]',
        image: 'bg-[#bd10e0]/30 border-[#bd10e0]/50 text-[#bd10e0]',
        text: 'bg-[#f5a623]/30 border-[#f5a623]/50 text-[#f5a623]',
        sticker: 'bg-[#d0021b]/30 border-[#d0021b]/50 text-[#d0021b]',
    };

    return (
        <div
            ref={(el) => { if (el) dragRef(el); }}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedClipId(clip.id);
            }}
            onContextMenu={handleContextMenu}
            className={cn(
                "absolute top-1 bottom-1 rounded border overflow-hidden cursor-move transition-all flex items-center px-1 text-[10px] font-bold uppercase",
                colors[clip.type as keyof typeof colors] || colors.video,
                isSelected && "ring-2 ring-white border-white brightness-125 z-10 scale-[1.01]",
                isDragging && "opacity-50",
                isResizing && "cursor-col-resize select-none"
            )}
            style={{
                left: `${clip.start * zoomLevel}px`,
                width: `${clip.duration * zoomLevel}px`,
            }}
        >
            {/* Resizing Handles */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/20 z-20"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-white/20 z-20"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />

            {clip.waveform && (
                <div className="absolute inset-x-1 inset-y-2 flex items-end gap-[1px] opacity-40 pointer-events-none">
                    {clip.waveform.map((val, i) => (
                        <div
                            key={i}
                            className="bg-current flex-1"
                            style={{ height: `${val * 100}%` }}
                        />
                    ))}
                </div>
            )}

            <span className="truncate flex-1 pointer-events-none relative z-10">{clip.name}</span>
        </div>
    );
};

export default ClipItem;
