"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Video, Palette } from 'lucide-react';

export const ChangelogModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const VERSION = '1.2.0'; // Current version

    useEffect(() => {
        const lastSeen = localStorage.getItem('contextmatic_changelog_seen');
        if (lastSeen !== VERSION) {
            const timer = setTimeout(() => setIsOpen(true), 1500); // Show after a delay
            return () => clearTimeout(timer);
        }
    }, []);

    const closeChangelog = () => {
        localStorage.setItem('contextmatic_changelog_seen', VERSION);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#141416] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="relative p-8">
                    <button 
                        onClick={closeChangelog}
                        className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Version v{VERSION}</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-6">What's New in ContextMatic</h2>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Video className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">AI Video Generation</h3>
                                <p className="text-sm text-gray-400">Transform text prompts into high-quality viral videos for TikTok and Reels in seconds.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                                <Palette className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Brand Identity Suite</h3>
                                <p className="text-sm text-gray-400">Our new AI Logo Maker helps you build a professional brand identity instantly.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Production-Ready Core</h3>
                                <p className="text-sm text-gray-400">Experience faster generation speeds and rock-solid reliability with our optimized AI infrastructure.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={closeChangelog}
                        className="w-full mt-10 py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform active:scale-95"
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
};
