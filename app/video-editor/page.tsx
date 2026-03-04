"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/shared';

export default function VideoEditorPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('assets');
    const [currentTime, setCurrentTime] = useState(0);

    const assets = [
        { id: '1', type: 'video', name: 'Background_01.mp4', duration: '15s', thumb: '🎬' },
        { id: '2', type: 'audio', name: 'Lo-fi_Beats.mp3', duration: '2:30', thumb: '🎵' },
        { id: '3', type: 'text', name: 'Title Overlay', duration: '5s', thumb: 'T' },
    ];

    return (
        <PageLayout>
            <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
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
                        <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition-all">Save Draft</button>
                        <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all">Export Video</button>
                    </div>
                </div>

                {/* Main Editor Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col">
                        <div className="p-4 flex gap-2 border-b border-white/5">
                            {['Assets', 'AI Effects', 'Library'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.toLowerCase() ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {assets.map(asset => (
                                <div key={asset.id} className="group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">{asset.thumb}</div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                                            <p className="text-[10px] text-zinc-500">{asset.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="dashed-border p-8 rounded-xl border-2 border-dashed border-white/5 text-center flex flex-col items-center gap-2">
                                <span className="text-2xl opacity-30">📤</span>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Media</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex-1 bg-zinc-950/50 p-12 flex flex-col items-center justify-center relative">
                        <div className="aspect-video w-full max-w-3xl bg-black rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                            <span className="text-text-secondary font-mono text-sm">PREVIEW WINDOW</span>

                            {/* Player Controls overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-white hover:scale-110 transition-transform">⏮</button>
                                <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center pl-1">▶</button>
                                <button className="p-2 text-white hover:scale-110 transition-transform">⏭</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="h-64 border-t border-white/10 bg-black/40 flex flex-col">
                    <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                        <span>Timeline - Layered Components</span>
                        <div className="flex items-center gap-4">
                            <span>00:00:{currentTime.toString().padStart(2, '0')}</span>
                            <div className="flex gap-1">
                                <button className="p-1 hover:text-white transition-colors">🔍-</button>
                                <button className="p-1 hover:text-white transition-colors">🔍+</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto p-4 space-y-2">
                        {/* Audio Layer */}
                        <div className="h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-lg w-[80%] relative flex items-center px-4">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase">🎵 Background Audio</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent w-full h-full animate-pulse" />
                        </div>
                        {/* Video Layer */}
                        <div className="h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg w-[60%] relative flex items-center px-4">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">🎬 Active Clip</span>
                        </div>
                        {/* Text Layer */}
                        <div className="h-12 bg-purple-500/10 border border-purple-500/20 rounded-lg w-[30%] ml-[20%] relative flex items-center px-4">
                            <span className="text-[10px] font-bold text-purple-400 uppercase">T Subtitles</span>
                        </div>
                    </div>
                    <div className="h-1 bg-white/5 relative">
                        <div className="absolute top-0 bottom-0 w-px bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10 left-[40%]" />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
