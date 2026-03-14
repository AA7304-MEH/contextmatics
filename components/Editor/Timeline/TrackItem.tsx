"use client";

import React, { useMemo } from 'react';
import { Track } from '../../../types/editor';
import ClipItem from './ClipItem';

interface TrackItemProps {
    track: Track;
    zoomLevel: number;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, zoomLevel }) => {
    const gridLines = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="h-full w-px bg-white" style={{ marginLeft: `${zoomLevel}px` }} />
        ));
    }, [zoomLevel]);

    return (
        <div className="h-16 flex border-b border-white/5 group relative">
            <div className="w-[150px] border-r border-white/10 bg-[#1a1a1a] flex flex-col justify-center px-4 z-10 shrink-0">
                <span className="text-[10px] font-bold text-white/60 truncate">{track.name}</span>
                <div className="flex gap-2 mt-1">
                    <button className={`text-[8px] px-1 rounded border transition-colors ${track.muted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}>M</button>
                    <button className={`text-[8px] px-1 rounded border transition-colors ${track.locked ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}>L</button>
                </div>
            </div>

            <div className="flex-1 relative bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors overflow-hidden">
                {track.clips.map((clip) => (
                    <ClipItem key={clip.id} clip={clip} zoomLevel={zoomLevel} />
                ))}

                {/* Track Grid Lines (Simplified) */}
                <div className="absolute inset-0 pointer-events-none opacity-5 flex">
                    {gridLines}
                </div>
            </div>
        </div>
    );
};

export default React.memo(TrackItem, (prevProps, nextProps) => {
    return (
        prevProps.zoomLevel === nextProps.zoomLevel &&
        prevProps.track.id === nextProps.track.id &&
        prevProps.track.clips === nextProps.track.clips &&
        prevProps.track.muted === nextProps.track.muted &&
        prevProps.track.locked === nextProps.track.locked
    );
});
