"use client";

import React from 'react';

interface RulerProps {
    duration: number;
    zoomLevel: number;
    onClick: (time: number) => void;
}

const Ruler: React.FC<RulerProps> = ({ duration, zoomLevel, onClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        onClick(x / zoomLevel);
    };

    const markers = [];
    const step = zoomLevel > 100 ? 1 : zoomLevel > 50 ? 2 : 5;

    for (let i = 0; i <= duration; i += step) {
        markers.push(
            <div
                key={i}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${i * zoomLevel}px` }}
            >
                <div className="h-3 w-px bg-white/30" />
                <span className="text-[9px] text-white/40 mt-1">{i}s</span>

                {zoomLevel > 30 && i + step / 2 <= duration && (
                    <div
                        className="absolute top-0 h-1.5 w-px bg-white/10"
                        style={{ left: `${(step / 2) * zoomLevel}px` }}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className="absolute inset-0 cursor-pointer overflow-hidden"
            onClick={handleClick}
            style={{ width: `${duration * zoomLevel}px` }}
        >
            {markers}
        </div>
    );
};

export default Ruler;
