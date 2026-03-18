"use client";

import React from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { Clip, Effect } from '@/types/editor';
import {
    Volume2,
    Sun,
    Contrast,
    Type,
    Trash2,
    Sliders
} from 'lucide-react';

const PropertiesPanel: React.FC = () => {
    const { project, selectedClipId, updateClip, removeClip, addEffect, updateEffect } = useProjectStore();

    const selectedClip = project.tracks
        .flatMap(t => t.clips)
        .find(c => c.id === selectedClipId);

    if (!selectedClip) {
        return (
            <div className="w-[300px] border-l border-white/10 bg-[#1a1a1a] flex flex-col items-center justify-center text-white/20 p-8 text-center italic">
                <Sliders size={48} className="mb-4 opacity-10" />
                <p className="text-sm">Select a clip to view properties</p>
            </div>
        );
    }

    const getEffectValue = (type: string) => {
        return selectedClip.effects?.find(e => e.type === type)?.params.value ?? 100;
    };

    const handleEffectChange = (type: string, value: number) => {
        const existingEffect = selectedClip.effects?.find(e => e.type === type);
        if (existingEffect) {
            updateEffect(selectedClip.id, existingEffect.id, { params: { value } });
        } else {
            addEffect(selectedClip.id, {
                type,
                params: { value },
                enabled: true
            });
        }
    };

    return (
        <div className="w-[300px] border-l border-white/10 bg-[#1a1a1a] flex flex-col z-20 overflow-y-auto custom-scrollbar">
            <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between sticky top-0 bg-[#1a1a1a] z-10">
                <span className="font-bold text-sm uppercase tracking-wider text-white/70">Properties</span>
                <button
                    onClick={() => removeClip(selectedClip.id)}
                    className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Basic Info */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Clip Name</label>
                    <input
                        type="text"
                        value={selectedClip.name}
                        onChange={(e) => updateClip(selectedClip.id, { name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00c8ff] focus:outline-none transition-colors"
                    />
                </div>

                {/* Audio Controls */}
                {(selectedClip.type === 'audio' || selectedClip.type === 'video') && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/50">
                            <Volume2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Audio</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-white/40">
                                <span>Volume</span>
                                <span>{selectedClip.speed === 1 ? '100%' : 'Normal'}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c8ff]"
                            />
                        </div>
                    </div>
                )}

                {/* Visual Effects */}
                {(selectedClip.type === 'video' || selectedClip.type === 'image') && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white/50">
                            <Sun size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Color & Light</span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-white/40">
                                    <span>Brightness</span>
                                    <span>{getEffectValue('brightness')}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={getEffectValue('brightness')}
                                    onChange={(e) => handleEffectChange('brightness', parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c8ff]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-white/40">
                                    <span>Contrast</span>
                                    <span>{getEffectValue('contrast')}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={getEffectValue('contrast')}
                                    onChange={(e) => handleEffectChange('contrast', parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c8ff]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-white/40">
                                    <span>Grayscale</span>
                                    <span>{getEffectValue('grayscale')}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={getEffectValue('grayscale')}
                                    onChange={(e) => handleEffectChange('grayscale', parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00c8ff]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Text Properties */}
                {selectedClip.type === 'text' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/50">
                            <Type size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Text Content</span>
                        </div>
                        <textarea
                            value={selectedClip.textContent}
                            onChange={(e) => updateClip(selectedClip.id, { textContent: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00c8ff] focus:outline-none transition-colors h-32 resize-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
