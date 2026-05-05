"use client";

import React, { useState } from 'react';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { 
    Upload, 
    Type, 
    Music, 
    Search,
    Plus,
    Cloud
} from 'lucide-react';

export const AssetsPanel: React.FC = () => {
    const { addClip, tracks } = useTimelineStore();
    const [activeTab, setActiveTab] = useState<'media' | 'text' | 'audio' | 'stickers'>('media');

    const handleAddAsset = (type: 'video' | 'audio' | 'text' | 'image', name: string, url?: string) => {
        // Find first track of correct type
        const track = tracks.find(t => t.type === type) || tracks[0];
        
        addClip({
            assetId: 'new-asset',
            type,
            name,
            startTime: 0,
            duration: type === 'video' ? 5 : 3,
            startOffset: 0,
            trackId: track.id,
            url
        });
    };

    return (
        <div className="w-80 border-r border-white/10 bg-zinc-950 flex flex-col h-full">
            {/* Nav Tabs */}
            <div className="flex border-b border-white/5">
                {(['media', 'audio', 'text', 'stickers'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            activeTab === tab 
                                ? 'text-white border-b-2 border-white' 
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search assets..." 
                        className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/10"
                    />
                </div>

                {activeTab === 'media' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center aspect-square rounded-xl bg-white/5 border border-dashed border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-zinc-500 hover:text-white">
                                <Upload size={24} />
                                <span className="text-[10px] font-bold uppercase mt-2">Upload</span>
                            </button>
                            <button className="flex flex-col items-center justify-center aspect-square rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-blue-400">
                                <Cloud size={24} />
                                <span className="text-[10px] font-bold uppercase mt-2">Stock</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Mock assets */}
                            <div 
                                onClick={() => handleAddAsset('video', 'Ocean Waves', 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4')}
                                className="group relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-white/5 cursor-pointer"
                            >
                                <img src="https://images.unsplash.com/photo-1505118380757-91f5fa572cda?w=400&q=80" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Ocean" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <Plus size={20} className="text-white" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[8px] text-zinc-400 font-mono">0:12</div>
                            </div>
                            
                            <div 
                                onClick={() => handleAddAsset('image', 'Forest View', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80')}
                                className="group relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-white/5 cursor-pointer"
                            >
                                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Forest" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <Plus size={20} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleAddAsset('text', 'Headline Text')}
                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                    <Type size={16} />
                                </div>
                                <span className="text-xs font-bold text-zinc-300">Add Headline</span>
                            </div>
                            <Plus size={16} className="text-zinc-600 group-hover:text-white" />
                        </button>
                    </div>
                )}

                {activeTab === 'audio' && (
                    <div className="space-y-3">
                        <button 
                            onClick={() => handleAddAsset('audio', 'Background Music', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')}
                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                    <Music size={16} />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs font-bold text-zinc-300">Synth Ambient</span>
                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">3:42 • 128 BPM</span>
                                </div>
                            </div>
                            <Plus size={16} className="text-zinc-600 group-hover:text-white" />
                        </button>
                    </div>
                )}

                {activeTab === 'stickers' && (
                    <div className="grid grid-cols-4 gap-2">
                        {['🔥', '✨', '🚀', '❤️', '👍', '😂', '🎉', '💡', '💎', '🔥', '🌈', '🤳'].map((emoji, i) => (
                            <button 
                                key={i}
                                onClick={() => handleAddAsset('text', emoji)}
                                className="aspect-square rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <button className="btn btn-secondary w-full py-2 flex items-center justify-center gap-2 border-white/5 hover:border-white/10 text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-white">
                    <Cloud size={14} />
                    Import from Snippets
                </button>
            </div>
        </div>
    );
};
