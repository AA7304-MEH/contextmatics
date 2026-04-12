"use client";

import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { Download, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EXPORT_COST = 10;

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { user, refreshProfile } = useAuth();
    const { clips, duration } = useTimelineStore();
    const [status, setStatus] = useState<'idle' | 'loading' | 'encoding' | 'completed' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const ffmpegRef = useRef(new FFmpeg());

    const hasEnoughCredits = (user?.processingCredits ?? 0) >= EXPORT_COST;

    const loadFFmpeg = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;
        
        ffmpeg.on('log', ({ message }) => {
            // Internal FFmpeg logs - silences for production
        });

        ffmpeg.on('progress', ({ progress: p }) => {
            setProgress(Math.round(p * 100));
        });

        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    };

    const handleExport = async () => {
        if (!hasEnoughCredits) {
            setError("Insufficient credits. Please upgrade your plan.");
            setStatus('error');
            return;
        }

        try {
            setStatus('loading');
            setError(null);
            
            await loadFFmpeg();
            
            const ffmpeg = ffmpegRef.current;
            setStatus('encoding');

            // 1. Download all assets to worker memory
            const mediaClips = clips.filter(c => c.type === 'video' || c.type === 'audio' || c.type === 'image');
            
            for (let i = 0; i < mediaClips.length; i++) {
                const clip = mediaClips[i];
                if (clip.url) {
                    const fileName = `input_${i}_${clip.id}`;
                    await ffmpeg.writeFile(fileName, await fetchFile(clip.url));
                }
            }

            // 2. Build FFmpeg command
            if (mediaClips.length > 0) {
                await ffmpeg.exec(['-i', `input_0_${mediaClips[0].id}`, '-t', String(duration), 'output.mp4']);
                
                const data = await ffmpeg.readFile('output.mp4');
                const url = URL.createObjectURL(new Blob([data as any], { type: 'video/mp4' }));
                
                // 3. Deduct credits
                const deductResponse = await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credits_deduction: EXPORT_COST })
                });

                if (!deductResponse.ok) {
                    throw new Error("Failed to deduct credits. Payment verification issue.");
                }

                // 4. Refresh user profile to update credits in UI
                await refreshProfile();

                setVideoUrl(url);
                setStatus('completed');
            } else {
                throw new Error("No media clips to export");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to export video");
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Export Project</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    {status === 'idle' && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 font-bold">
                                <Download size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Ready to Export?</h3>
                            <p className="text-xs text-zinc-500 mb-6 max-w-[240px]">
                                Your video will be rendered directly in your browser. This will cost <span className="text-white font-bold">{EXPORT_COST} credits</span>.
                            </p>

                            {!hasEnoughCredits && (
                                <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-8 flex items-start gap-3 text-left">
                                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-red-400">Insufficient Credits</p>
                                        <p className="text-[10px] text-zinc-500">You need {EXPORT_COST} credits but only have {user?.processingCredits ?? 0}.</p>
                                        <button 
                                            onClick={() => window.location.href = '/pricing'}
                                            className="text-[10px] font-bold text-white underline mt-2 hover:text-blue-400"
                                        >
                                            Upgrade Plan →
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleExport}
                                disabled={!hasEnoughCredits}
                                className={`w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${!hasEnoughCredits ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                Start Rendering
                            </button>
                        </>
                    )}

                    {(status === 'loading' || status === 'encoding') && (
                        <>
                            <div className="w-20 h-20 relative mb-8">
                                <Loader2 size={80} className="text-blue-500 animate-spin absolute inset-0" strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                                    {progress}%
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {status === 'loading' ? 'Initializing FFmpeg...' : 'Rendering Video...'}
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Please don't close this tab until rendering is complete.
                            </p>
                        </>
                    )}

                    {status === 'completed' && videoUrl && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-6">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Export Successful!</h3>
                            <p className="text-xs text-zinc-500 mb-8">
                                Your video is ready for download.
                            </p>
                            <a 
                                href={videoUrl}
                                download="contextmatic_export.mp4"
                                className="w-full py-4 bg-green-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={16} />
                                Download MP4
                            </a>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Export Failed</h3>
                            <p className="text-xs text-red-400/60 mb-8 px-4">
                                {error || "An unknown error occurred during rendering."}
                            </p>
                            <button 
                                onClick={handleExport}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
