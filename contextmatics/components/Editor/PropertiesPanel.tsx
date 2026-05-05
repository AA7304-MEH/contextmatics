"use client";

import React from 'react';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { 
    Sliders, 
    Type, 
    Layers, 
    Zap,
    Move,
    RotateCw,
    Trash2,
    Music
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
    const { selectedClipId, clips, updateClip, removeClip } = useTimelineStore();
    const clip = clips.find(c => c.id === selectedClipId);

    if (!clip) {
        return (
            <div className="w-80 border-l border-white/10 bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 mb-4">
                    <Sliders size={32} />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No selection</h3>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                    Select a clip on the timeline to adjust its properties.
                </p>
            </div>
        );
    }

    return (
        <div className="w-80 border-l border-white/10 bg-zinc-950 flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                            {clip.type === 'video' ? <Zap size={16} /> : <Type size={16} />}
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Properties</h2>
                    </div>
                    <button 
                        onClick={() => removeClip(clip.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <input 
                    type="text" 
                    value={clip.name}
                    onChange={(e) => updateClip(clip.id, { name: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/10"
                />
            </div>

            <div className="p-6 space-y-8">
                {/* Transform Section */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Move size={12} /> Transform
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Scale</span>
                            <div className="flex items-center gap-3">
                                <input type="range" className="w-24 accent-white h-1 bg-white/10 rounded-full appearance-none" />
                                <span className="text-[10px] font-mono text-zinc-400">100%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rotation</span>
                            <div className="flex items-center gap-3">
                                <RotateCw size={12} className="text-zinc-600" />
                                <span className="text-[10px] font-mono text-zinc-400">0°</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timing Section */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layers size={12} /> Timing
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Start</span>
                            <span className="text-xs font-mono text-white">{clip.startTime.toFixed(2)}s</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Duration</span>
                            <span className="text-xs font-mono text-white">{clip.duration.toFixed(2)}s</span>
                        </div>
                    </div>
                </div>

                {/* Text Config Section (Only for text clips) */}
                {clip.type === 'text' && (
                    <div>
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Type size={12} /> Text Styling
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Font Size</span>
                                <input 
                                    type="number" 
                                    value={clip.textConfig?.fontSize || 32}
                                    onChange={(e) => updateClip(clip.id, { 
                                        textConfig: { ...clip.textConfig, fontSize: Number(e.target.value) } 
                                    })}
                                    className="bg-white/5 border border-white/5 rounded-lg py-1.5 px-3 text-[10px] text-white w-20 text-center focus:outline-none focus:border-white/10"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Text Color</span>
                                <input 
                                    type="color" 
                                    value={clip.textConfig?.color || '#ffffff'}
                                    onChange={(e) => updateClip(clip.id, { 
                                        textConfig: { ...clip.textConfig, color: e.target.value } 
                                    })}
                                    className="bg-transparent border-0 w-8 h-8 p-0 cursor-pointer rounded overflow-hidden"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Visual Effects Section */}
                {(clip.type === 'video' || clip.type === 'image') && (
                    <div>
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={12} /> Visual Filters
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Brightness', effect: 'brightness', unit: '%', default: 100 },
                                { label: 'Contrast', effect: 'contrast', unit: '%', default: 100 },
                                { label: 'Blur', effect: 'blur', unit: 'px', default: 0 },
                                { label: 'Grayscale', effect: 'grayscale', unit: '%', default: 0 },
                                { label: 'Sepia', effect: 'sepia', unit: '%', default: 0 }
                            ].map((filter) => (
                                <div key={filter.effect} className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{filter.label}</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max={filter.effect === 'blur' ? 20 : 200}
                                            value={clip.effects?.[filter.effect as keyof typeof clip.effects] ?? filter.default}
                                            onChange={(e) => updateClip(clip.id, { 
                                                effects: { ...clip.effects, [filter.effect]: Number(e.target.value) } 
                                            })}
                                            className="w-24 accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer" 
                                        />
                                        <span className="text-[10px] font-mono text-zinc-500 w-8">
                                            {clip.effects?.[filter.effect as keyof typeof clip.effects] ?? filter.default}{filter.unit}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Audio Properties Section */}
                {(clip.type === 'video' || clip.type === 'audio') && (
                    <div>
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Music size={12} /> Audio Properties
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Volume</span>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100"
                                        value={clip.audioConfig?.volume ?? 100}
                                        onChange={(e) => updateClip(clip.id, { 
                                            audioConfig: { ...clip.audioConfig, volume: Number(e.target.value), fadeIn: clip.audioConfig?.fadeIn ?? 0, fadeOut: clip.audioConfig?.fadeOut ?? 0 } 
                                        })}
                                        className="w-24 accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer" 
                                    />
                                    <span className="text-[10px] font-mono text-zinc-500 w-8">
                                        {clip.audioConfig?.volume ?? 100}%
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Fade In</span>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        min="0"
                                        value={clip.audioConfig?.fadeIn ?? 0}
                                        onChange={(e) => updateClip(clip.id, { 
                                            audioConfig: { ...clip.audioConfig, volume: clip.audioConfig?.volume ?? 100, fadeIn: Number(e.target.value), fadeOut: clip.audioConfig?.fadeOut ?? 0 } 
                                        })}
                                        className="bg-transparent text-xs font-mono text-white w-full focus:outline-none"
                                    />
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Fade Out</span>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        min="0"
                                        value={clip.audioConfig?.fadeOut ?? 0}
                                        onChange={(e) => updateClip(clip.id, { 
                                            audioConfig: { ...clip.audioConfig, volume: clip.audioConfig?.volume ?? 100, fadeIn: clip.audioConfig?.fadeIn ?? 0, fadeOut: Number(e.target.value) } 
                                        })}
                                        className="bg-transparent text-xs font-mono text-white w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transitions Section */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <RotateCw size={12} /> Transitions
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">In Animation</span>
                            <select 
                                value={clip.transitions?.in?.type || 'none'}
                                onChange={(e) => updateClip(clip.id, { 
                                    transitions: { ...clip.transitions, in: e.target.value === 'none' ? undefined : { type: e.target.value as any, duration: 0.5 } } 
                                })}
                                className="bg-white/5 border border-white/5 rounded-lg py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                            >
                                <option value="none">None</option>
                                <option value="fade">Fade</option>
                                <option value="slide-left">Slide Left</option>
                                <option value="zoom-in">Zoom In</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Out Animation</span>
                            <select 
                                value={clip.transitions?.out?.type || 'none'}
                                onChange={(e) => updateClip(clip.id, { 
                                    transitions: { ...clip.transitions, out: e.target.value === 'none' ? undefined : { type: e.target.value as any, duration: 0.5 } } 
                                })}
                                className="bg-white/5 border border-white/5 rounded-lg py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                            >
                                <option value="none">None</option>
                                <option value="fade">Fade</option>
                                <option value="slide-right">Slide Right</option>
                                <option value="zoom-out">Zoom Out</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
