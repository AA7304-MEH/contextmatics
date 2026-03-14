"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useProjectStore } from '../../../stores/projectStore';
import { Clip } from '../../../types/editor';
import { audioMixer } from '../../../lib/audioMixer';

const PreviewCanvas: React.FC = () => {
    const { project, playheadTime, isPlaying, setPlayheadTime, setIsPlaying } = useProjectStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // Resize canvas to maintain aspect ratio
    useEffect(() => {
        const resizeCanvas = () => {
            if (!canvasRef.current) return;
            const parent = canvasRef.current.parentElement;
            if (!parent) return;

            const { width, height } = project.resolution;
            const parentRatio = parent.clientWidth / parent.clientHeight;
            const projectRatio = width / height;

            if (parentRatio > projectRatio) {
                canvasRef.current.style.height = '100%';
                canvasRef.current.style.width = 'auto';
            } else {
                canvasRef.current.style.width = '100%';
                canvasRef.current.style.height = 'auto';
            }

            canvasRef.current.width = width;
            canvasRef.current.height = height;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [project.resolution]);

    const videoPool = useRef<Record<string, HTMLVideoElement>>({});
    const [draftMode, setDraftMode] = useState(true);

    // Handle Playback
    useEffect(() => {
        if (isPlaying) {
            audioMixer.play(project, playheadTime);
            let lastUpdate = performance.now();
            const animate = () => {
                const now = performance.now();
                const delta = (now - lastUpdate) / 1000;
                lastUpdate = now;

                if (delta > 0) {
                    setPlayheadTime(playheadTime + delta);
                }
                requestRef.current = requestAnimationFrame(animate);
            };
            requestRef.current = requestAnimationFrame(animate);
        } else {
            audioMixer.stopAll();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            audioMixer.stopAll();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, playheadTime, setPlayheadTime, project]);

    // Render Loop
    useEffect(() => {
        let isCancelled = false;
        const render = async () => {
            if (!canvasRef.current || isCancelled) return;
            const ctx = canvasRef.current.getContext('2d', { alpha: false });
            if (!ctx) return;

            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            if (draftMode) {
                ctx.imageSmoothingEnabled = false;
            } else {
                ctx.imageSmoothingEnabled = true;
            }

            // Find active clips
            const activeClips: Clip[] = [];
            project.tracks.forEach(track => {
                track.clips.forEach(clip => {
                    if (playheadTime >= clip.start && playheadTime < clip.start + clip.duration) {
                        activeClips.push(clip);
                    }
                });
            });

            for (const clip of activeClips) {
                const relativeTime = (playheadTime - clip.start) * clip.speed + clip.sourceStart;

                if (clip.type === 'video' || clip.type === 'image') {
                    await renderVisualClip(ctx, clip, relativeTime);
                } else if (clip.type === 'text') {
                    renderTextClip(ctx, clip);
                }
            }
        };

        render();
        return () => { isCancelled = true; };
    }, [playheadTime, project.tracks, draftMode]);

    const renderVisualClip = async (ctx: CanvasRenderingContext2D, clip: Clip, time: number) => {
        ctx.save();

        // Apply Filters
        if (clip.effects && clip.effects.length > 0) {
            ctx.filter = clip.effects.map(eff => {
                if (eff.type === 'brightness') return `brightness(${eff.params.value}%)`;
                if (eff.type === 'contrast') return `contrast(${eff.params.value}%)`;
                if (eff.type === 'grayscale') return `grayscale(${eff.params.value}%)`;
                return '';
            }).join(' ');
        }

        if (clip.type === 'image') {
            let img = (window as any)._imagePathCache?.[clip.url];
            if (!img) {
                img = new Image();
                img.src = clip.url;
                if (!(window as any)._imagePathCache) (window as any)._imagePathCache = {};
                (window as any)._imagePathCache[clip.url] = img;
                await new Promise(r => img.onload = r);
            }

            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else if (clip.type === 'video') {
            let video = videoPool.current[clip.id];
            if (!video) {
                video = document.createElement('video');
                video.src = clip.url;
                video.muted = true;
                video.preload = 'auto';
                videoPool.current[clip.id] = video;
                await new Promise(r => video.onloadedmetadata = r);
            }

            // Optimization: Only seek if the time difference is significant
            if (Math.abs(video.currentTime - time) > 0.03) {
                video.currentTime = time;
            }

            ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        ctx.restore();
    };

    const renderTextClip = (ctx: CanvasRenderingContext2D, clip: Clip) => {
        if (!clip.textContent) return;
        const style = clip.textStyle || { fontSize: 80, color: 'white', fontFamily: 'Inter', textAlign: 'center' };

        ctx.font = `${style.fontSize}px ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textAlign = style.textAlign;

        const x = style.textAlign === 'center' ? ctx.canvas.width / 2 : style.textAlign === 'right' ? ctx.canvas.width - 50 : 50;
        const y = ctx.canvas.height / 2;

        ctx.fillText(clip.textContent, x, y);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative group">
            <div className="flex-1 bg-zinc-900 border border-white/5 shadow-2xl rounded-lg overflow-hidden flex items-center justify-center relative w-full">
                {/* Transparent Checkerboard Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <canvas ref={canvasRef} className="shadow-2xl z-10" />
            </div>

            {/* Playback Controls */}
            <div className="h-12 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setPlayheadTime(0)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-white" />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                    {isPlaying ? (
                        <div className="w-3 h-4 flex justify-between">
                            <div className="w-1 h-full bg-black" />
                            <div className="w-1 h-full bg-black" />
                        </div>
                    ) : (
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-black ml-1" />
                    )}
                </button>

                <div className="text-xs font-mono text-white/60 min-w-[100px] text-center">
                    {Math.floor(playheadTime / 60).toString().padStart(2, '0')}:{(Math.floor(playheadTime % 60)).toString().padStart(2, '0')}.{Math.floor((playheadTime % 1) * 10)}
                </div>

                <button
                    onClick={() => setDraftMode(!draftMode)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${draftMode
                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                            : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                        }`}
                    title={draftMode ? "Draft Mode: High Performance" : "Final Mode: High Quality"}
                >
                    {draftMode ? 'Draft' : 'Final'}
                </button>
            </div>
        </div>
    );
};

export default PreviewCanvas;
