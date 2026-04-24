"use client";

import React, { useState, useEffect } from 'react';
import {
    Library,
    Type,
    Sticker,
    Wand2,
    Music,
    Plus,
    Video
} from 'lucide-react';
import { mediaManager, MediaAsset } from '../../lib/mediaManager';
import { useProjectStore } from '../../stores/projectStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'media' | 'text' | 'stickers' | 'effects' | 'audio'>('media');
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const { addClip } = useProjectStore();

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        const allAssets = await mediaManager.getAllAssets();
        setAssets(allAssets);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            await mediaManager.importFile(file);
        }
        loadAssets();
    };

    const handleDragStart = (e: React.DragEvent, asset: MediaAsset) => {
        e.dataTransfer.setData('asset', JSON.stringify(asset));
    };

    const handleAddAssetToTimeline = (asset: MediaAsset) => {
        const trackId = asset.type === 'audio' ? 'track-a1' : 'track-v1';
        addClip(trackId, {
            type: asset.type,
            name: asset.name,
            assetId: asset.id,
            url: URL.createObjectURL(asset.blob),
            waveform: asset.waveform,
            start: 0,
            duration: asset.duration || 5,
            sourceStart: 0,
            sourceDuration: asset.duration || 5,
            speed: 1,
        });
    };

    const tabs = [
        { id: 'media', icon: Library, label: 'Media' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'stickers', icon: Sticker, label: 'Stickers' },
        { id: 'effects', icon: Wand2, label: 'Effects' },
        { id: 'audio', icon: Music, label: 'Audio' },
    ];

    return (
        <aside className="w-[300px] border-r border-white/10 bg-[#1a1a1a] flex flex-col z-20">
            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex-1 flex flex-col items-center py-3 gap-1 transition-all border-b-2 font-medium",
                            activeTab === tab.id
                                ? "text-[#00c8ff] border-[#00c8ff] bg-white/5"
                                : "text-white/40 border-transparent hover:text-white/60 hover:bg-white/[0.02]"
                        )}
                    >
                        <tab.icon size={20} />
                        <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === 'media' && (
                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00c8ff]/50 hover:bg-[#00c8ff]/5 transition-all cursor-pointer group">
                            <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="video/*,audio/*,image/*" />
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                                <Plus size={20} className="text-white/60 group-hover:text-[#00c8ff]" />
                            </div>
                            <span className="text-xs font-bold text-white/60 group-hover:text-white">Import Media</span>
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            {assets.map((asset) => (
                                <div
                                    key={asset.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, asset)}
                                    onClick={() => handleAddAssetToTimeline(asset)}
                                    className="bg-white/5 border border-white/10 rounded-lg overflow-hidden group cursor-pointer hover:border-[#00c8ff]/50 transition-all relative aspect-video"
                                >
                                    {asset.thumbnailUrl ? (
                                        <img src={asset.thumbnailUrl} className="w-full h-full object-cover" alt={asset.name} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30">
                                            {asset.type === 'video' ? <Video size={24} /> : asset.type === 'audio' ? <Music size={24} /> : <Library size={24} />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Plus size={20} className="text-white" />
                                    </div>
                                    <div className="absolute bottom-1 left-1 right-1">
                                        <p className="text-[10px] text-white/80 bg-black/40 px-1 py-0.5 rounded truncate">{asset.name}</p>
                                    </div>
                                    {asset.duration && (
                                        <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded text-white/90">
                                            {Math.floor(asset.duration / 60)}:{(Math.floor(asset.duration % 60)).toString().padStart(2, '0')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Text Presets</h3>
                        {[
                            { name: 'Headline', size: 'text-2xl', weight: 'font-black' },
                            { name: 'Subheadline', size: 'text-lg', weight: 'font-bold' },
                            { name: 'Body Text', size: 'text-sm', weight: 'font-medium' },
                            { name: 'Caption', size: 'text-xs', weight: 'italic' },
                        ].map((txt) => (
                            <button
                                key={txt.name}
                                onClick={() => addClip('track-t1', {
                                    type: 'text',
                                    name: txt.name,
                                    assetId: 'text-asset',
                                    url: '',
                                    start: useProjectStore.getState().playheadTime,
                                    duration: 5,
                                    sourceStart: 0,
                                    sourceDuration: 5,
                                    speed: 1,
                                    textContent: txt.name,
                                    textStyle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', fontFamily: 'Inter', textAlign: 'center' }
                                } as any)}
                                className="w-full p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-[#00c8ff]/30 transition-all flex items-center justify-between group"
                            >
                                <span className={`${txt.size} ${txt.weight} text-white truncate`}>{txt.name}</span>
                                <Plus size={16} className="text-white/20 group-hover:text-[#00c8ff]" />
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'stickers' && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Graphics & Overlays</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['🎬', '🔥', '✨', '⚡', '🚀', '❤️', '✅', '❌', '💡', '🔔', '💬', '📍'].map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => addClip('track-v1', {
                                        type: 'sticker',
                                        name: 'Sticker',
                                        assetId: 'sticker-asset',
                                        url: '',
                                        start: useProjectStore.getState().playheadTime,
                                        duration: 3,
                                        sourceStart: 0,
                                        sourceDuration: 3,
                                        speed: 1,
                                        textContent: emoji
                                    } as any)}
                                    className="aspect-square bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 hover:border-[#00c8ff]/30 transition-all active:scale-95"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'effects' && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Visual Filters</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { name: 'Noir (B&W)', type: 'grayscale', value: 1 },
                                { name: 'Sepia', type: 'sepia', value: 0.8 },
                                { name: 'Vibrant', type: 'saturate', value: 2 },
                                { name: 'Blur', type: 'blur', value: '5px' },
                                { name: 'Invert', type: 'invert', value: 1 },
                                { name: 'Cold', type: 'hue-rotate', value: '180deg' },
                            ].map((effect) => (
                                <button
                                    key={effect.name}
                                    onClick={() => {
                                        const selectedId = useProjectStore.getState().selectedClipId;
                                        if (selectedId) {
                                            useProjectStore.getState().addEffect(selectedId, {
                                                type: effect.type,
                                                params: { value: effect.value },
                                                enabled: true
                                            });
                                        } else {
                                            alert("Please select a clip on the timeline first.");
                                        }
                                    }}
                                    className="w-full p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-[#00c8ff]/10 hover:border-[#00c8ff]/50 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-blue-400">
                                        <Wand2 size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-white/80 group-hover:text-white">{effect.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'audio' && (
                    <div className="space-y-4 text-left">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Audio Assets</h3>
                        {assets.filter(a => a.type === 'audio').length > 0 ? (
                            assets.filter(a => a.type === 'audio').map((asset) => (
                                <button
                                    key={asset.id}
                                    onClick={() => handleAddAssetToTimeline(asset)}
                                    className="w-full p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-[#00c8ff]/50 transition-all flex items-center gap-3 text-left group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-pink-500">
                                        <Music size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{asset.name}</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-tighter">Audio Clip</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="py-12 text-center text-white/20">
                                <Music size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="text-xs font-medium">No audio assets found.<br/>Import MP3/WAV files in Media tab.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
