"use client";

import React, { useRef } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import Ruler from './Ruler';
import TrackItem from './TrackItem';
import { useDrop } from 'react-dnd';
import { MediaAsset } from '../../../lib/mediaManager';

const TimelineContainer: React.FC = () => {
    const {
        project,
        zoomLevel,
        setZoomLevel,
        playheadTime,
        setPlayheadTime,
        addClip,
        setSelectedClipId
    } = useProjectStore();

    const timelineRef = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop(() => ({
        accept: 'asset',
        drop: (item:any, monitor) => {
            const asset = item as MediaAsset;
            const offset = monitor.getClientOffset();
            if (!offset || !timelineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const x = offset.x - rect.left + timelineRef.current.scrollLeft;
            const time = Math.max(0, (x - 150) / zoomLevel); // 150px is the track header width

            // Determine track based on Y position (simplified for now)
            const y = offset.y - rect.top;
            const trackIndex = Math.floor((y - 40) / 64); // 40px ruler, 64px track height
            const track = project.tracks[Math.max(0, Math.min(trackIndex, project.tracks.length - 1))];

            addClip(track.id, {
                type: asset.type,
                name: asset.name,
                assetId: asset.id,
                url: URL.createObjectURL(asset.blob),
                waveform: asset.waveform,
                start: time,
                duration: asset.duration || 5,
                sourceStart: 0,
                sourceDuration: asset.duration || 5,
                speed: 1,
            });
        },
    }), [zoomLevel, project.tracks]);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        const time = Math.max(0, (x - 150) / zoomLevel);
        setPlayheadTime(time);
        setSelectedClipId(null);
    };

    return (
        <div
            className="h-[300px] border-t border-white/10 bg-[#1a1a1a] flex flex-col relative overflow-hidden select-none"
            onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedClipId(null);
            }}
        >
            <div className="flex h-10 border-b border-white/5 bg-[#121212] sticky top-0 z-20">
                <div className="w-[150px] border-r border-white/10 flex items-center justify-between px-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tracks</span>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                        className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c8ff]"
                    />
                </div>
                <div className="flex-1 relative overflow-hidden">
                    <Ruler duration={project.duration} zoomLevel={zoomLevel} onClick={setPlayheadTime} />
                </div>
            </div>

            <div
                ref={(el) => {
                    if (el) {
                        (timelineRef as any).current = el;
                        drop(el);
                    }
                }}
                className="flex-1 overflow-both custom-scrollbar relative"
                onClick={handleTimelineClick}
            >
                <div className="flex flex-col min-h-full" style={{ width: `${project.duration * zoomLevel + 150}px` }}>
                    {project.tracks.map((track) => (
                        <TrackItem key={track.id} track={track} zoomLevel={zoomLevel} />
                    ))}

                    {/* Playhead */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-[#00c8ff] shadow-[0_0_10px_rgba(0,200,255,0.8)] z-30 pointer-events-none"
                        style={{ left: `${playheadTime * zoomLevel + 150}px` }}
                    >
                        <div className="absolute top-[-10px] left-[-6px] w-3 h-3 bg-[#00c8ff] rotate-45" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineContainer;
