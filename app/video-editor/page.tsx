"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/shared';
import { useVideo } from '@/context/VideoContext';
import { useHistory } from '@/context/HistoryContext';
import { Video, Snippet } from '@/types';

interface TimelineClip {
    id: string;
    assetId: string;
    type: 'video' | 'audio' | 'text' | 'image';
    name: string;
    startTime: number; // in seconds
    duration: number;
    track: number;
    url?: string;
}

export default function VideoEditorPage() {
    const router = useRouter();
    const { videos, loading: videosLoading } = useVideo();
    const { historyItems, loading: historyLoading } = useHistory();

    const [activeTab, setActiveTab] = useState('assets');
    const [uploadedAssets, setUploadedAssets] = useState<any[]>([]);
    const [uploadingFile, setUploadingFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(60); // Default 60s timeline

    const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

    const playheadRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync playback
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 0.1;
                });
            }, 100);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPlaying, duration]);

    const addToTimeline = (asset: any, type: 'video' | 'audio' | 'text' | 'image') => {
        const newClip: TimelineClip = {
            id: Math.random().toString(36).substr(2, 9),
            assetId: asset.id,
            type,
            name: asset.title || asset.prompt || 'New Clip',
            startTime: currentTime,
            duration: type === 'text' || type === 'image' ? 5 : 10,
            track: type === 'video' || type === 'image' ? 1 : type === 'audio' ? 0 : 2,
            url: asset.url
        };
        setTimelineClips([...timelineClips, newClip]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const handleExport = () => {
        setIsExporting(true);
        setExportProgress(0);
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsExporting(false), 1000);
                    return 100;
                }
                return prev + 5;
            });
        }, 200);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(file.name);
        // Simulate upload
        setTimeout(() => {
            const newAsset = {
                id: 'upl-' + Date.now(),
                title: file.name,
                type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio',
                url: URL.createObjectURL(file),
                thumb: file.type.startsWith('image') ? '🖼️' : file.type.startsWith('video') ? '🎬' : '🎵'
            };
            setUploadedAssets(prev => [newAsset, ...prev]);
            setUploadingFile(null);
        }, 1500);
    };

    return (
        <PageLayout>
            <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
                {/* Editor Header */}
                <div className="h-14 border-b border-white/10 bg-black/40 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="text-zinc-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-bold text-white tracking-tight uppercase">AI Video Editor</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition-all">Save Project</button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                        >
                            Export Video
                        </button>
                    </div>
                </div>

                {/* Main Editor Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col">
                        <div className="p-4 flex gap-2 border-b border-white/5 overflow-x-auto no-scrollbar">
                            {['Assets', 'AI FX', 'Captions', 'Library'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {activeTab === 'assets' && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="video/*,audio/*,image/*"
                                    />

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 bg-black/20 text-center flex flex-col items-center gap-3 mb-8 cursor-pointer transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">📂</div>
                                        <div>
                                            <p className="text-xs font-bold text-white mb-1">Import Media</p>
                                            <p className="text-[10px] text-zinc-500">Drag & drop or browse files</p>
                                        </div>
                                    </div>

                                    {uploadingFile && (
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 animate-pulse mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-xs">⏳</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-white truncate">{uploadingFile}</p>
                                                    <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-blue-500 w-1/2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {uploadedAssets.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Uploads</h4>
                                            <div className="space-y-2">
                                                {uploadedAssets.map(asset => (
                                                    <div
                                                        key={asset.id}
                                                        onClick={() => addToTimeline(asset, asset.type)}
                                                        className="group p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all cursor-pointer"
                                                    >
                                                        <div className="flex gap-2 items-center">
                                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs">{asset.thumb}</div>
                                                            <p className="text-[10px] font-medium text-white truncate flex-1">{asset.title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Generated Videos</h4>
                                    {videos.map(video => (
                                        <div
                                            key={video.id}
                                            onClick={() => addToTimeline(video, 'video')}
                                            className="group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">🎬</div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="text-xs font-semibold text-white truncate">{video.prompt}</p>
                                                    <p className="text-[10px] text-zinc-500">{video.platform}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-6 mb-2">Text Snippets</h4>
                                    {historyItems.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => addToTimeline(item, 'text')}
                                            className="group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer"
                                        >
                                            <div className="flex gap-3 items-center">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">T</div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                                                    <p className="text-[10px] text-zinc-500">{item.format}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {activeTab === 'ai fx' && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Smart Effects</h4>
                                    {[
                                        { name: 'Smart Trim', icon: '✂️', desc: 'Auto-remove silences' },
                                        { name: 'Color Match', icon: '🎨', desc: 'Sync cinematic grades' },
                                        { name: 'Noise Cancel', icon: '🔇', desc: 'AI Background Cleanup' }
                                    ].map(fx => (
                                        <div key={fx.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer">
                                            <span className="text-xl mb-2 block">{fx.icon}</span>
                                            <p className="text-xs font-bold text-white mb-1">{fx.name}</p>
                                            <p className="text-[10px] text-zinc-500">{fx.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'captions' && (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-center">
                                        <span className="text-3xl mb-4 block">💬</span>
                                        <h4 className="text-sm font-bold text-white mb-2">AI Auto-Captions</h4>
                                        <p className="text-[10px] text-zinc-400 mb-6 leading-relaxed">Transcribe audio and add stylized subtitle overlays automatically.</p>
                                        <button
                                            onClick={() => {
                                                const captionClip: TimelineClip = {
                                                    id: 'captions-' + Date.now(),
                                                    assetId: 'ai-captions',
                                                    type: 'text',
                                                    name: '✨ AI Captions',
                                                    startTime: 0,
                                                    duration: duration,
                                                    track: 2
                                                };
                                                setTimelineClips([...timelineClips, captionClip]);
                                            }}
                                            className="w-full py-3 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            Generate Captions
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Subtitle Styles</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Modern', 'Retro', 'Dynamic', 'Clean'].map(style => (
                                                <div key={style} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-bold text-zinc-400 text-center hover:bg-white/5 cursor-pointer">
                                                    {style}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'library' && (
                                <div className="text-center py-20 px-10">
                                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Sparkles className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Enterprise Engine</h3>
                                    <p className="text-[10px] text-zinc-500 max-w-[200px] mx-auto leading-relaxed">
                                        High-fidelity stock library integration is reserved for Enterprise workspaces. Contact sales to activate.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Preview Panel */}
                    <div className="flex-1 bg-zinc-950/50 p-12 flex flex-col items-center justify-center relative">
                        <div className="aspect-video w-full max-w-3xl bg-black rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                            <span className="text-text-secondary font-mono text-sm">PREVIEW WINDOW</span>

                            {/* Player Controls overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setCurrentTime(0)} className="p-2 text-white hover:scale-110 transition-transform">⏮</button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center pl-1"
                                >
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <button onClick={() => setCurrentTime(duration)} className="p-2 text-white hover:scale-110 transition-transform">⏭</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="h-64 border-t border-white/10 bg-black/40 flex flex-col">
                    <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                        <span>Timeline - Multi-Track Editor</span>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-white">{formatTime(currentTime)} / {formatTime(duration)}</span>
                            <div className="flex gap-1">
                                <button onClick={() => setDuration(d => Math.max(10, d - 10))} className="p-1 hover:text-white transition-colors">🔍-</button>
                                <button onClick={() => setDuration(d => d + 10)} className="p-1 hover:text-white transition-colors">🔍+</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto p-4 relative min-w-full" style={{ width: `${duration * 20}px` }}>
                        {/* Track Layers */}
                        <div className="space-y-2 relative z-0">
                            {[2, 1, 0].map(trackIndex => (
                                <div key={trackIndex} className="h-12 w-full bg-white/[0.02] border-y border-white/5 relative">
                                    {timelineClips.filter(c => c.track === trackIndex).map(clip => (
                                        <div
                                            key={clip.id}
                                            onClick={() => setSelectedClipId(clip.id)}
                                            style={{
                                                left: `${clip.startTime * 20}px`,
                                                width: `${clip.duration * 20}px`
                                            }}
                                            className={`absolute inset-y-1 rounded-md border flex items-center px-3 cursor-pointer transition-all ${selectedClipId === clip.id ? 'ring-2 ring-white border-white scale-[1.02] z-10' : 'border-white/20'
                                                } ${clip.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                                                    clip.type === 'image' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        clip.type === 'audio' ? 'bg-indigo-500/20 text-indigo-400' :
                                                            'bg-purple-500/20 text-purple-400'
                                                }`}
                                        >
                                            <span className="text-[10px] font-bold uppercase truncate">{clip.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Playhead */}
                        <div
                            className="absolute top-0 bottom-0 w-px bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-20 pointer-events-none"
                            style={{ left: `${currentTime * 20}px` }}
                        />
                    </div>
                </div>

                {/* Export Overlay */}
                {isExporting && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="max-w-sm w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-white rounded-full animate-spin" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Exporting Video</h3>
                            <p className="text-xs text-zinc-500 mb-8">Rendering your project on our high-performance GPU nodes...</p>

                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${exportProgress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                                <span>{exportProgress}% Complete</span>
                                <span>{exportProgress < 100 ? 'Rendering...' : 'Done!'}</span>
                            </div>

                            {exportProgress === 100 && (
                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = '#'; // Mock final video link
                                        link.download = 'project_export.mp4';
                                        link.click();
                                        setIsExporting(false);
                                    }}
                                    className="w-full py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>⬇️</span> Download Final Video
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
