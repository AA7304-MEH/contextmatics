"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/shared';

export default function FacelessStudioPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const steps = [
        { id: 1, name: 'Script & Theme', icon: '📝' },
        { id: 2, name: 'AI Voice', icon: '🎙️' },
        { id: 3, name: 'Visual Assets', icon: '🎞️' },
        { id: 4, name: 'Review', icon: '✨' },
    ];

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
        else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                router.push('/dashboard');
            }, 3000);
        }
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 md:py-20 text-left">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Faceless Studio</h1>
                            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Create Viral Automations</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-zinc-500">PRO FEATURE</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">👑</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-16 relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-zinc-800 text-zinc-600 border border-white/5'}`}>
                                    {step > s.id ? '✓' : s.id}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-zinc-600'}`}>{s.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Content Box */}
                    <div className="card min-h-[400px] border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50" />

                        {step === 1 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider block">What's your story about?</label>
                                    <textarea placeholder="e.g. A mystery about the lost city of Atlantis..." className="input h-32 text-white bg-white/5 border-white/10 p-4 rounded-xl w-full" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Documentary', 'Storytelling', 'News', 'Explainer'].map(t => (
                                        <button key={t} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all text-sm font-bold text-zinc-400 hover:text-white">{t}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Select AI Voice Artist</h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Marcus', desc: 'Deep, Narrative, Authoritative', icon: '🧔' },
                                        { name: 'Sarah', desc: 'Clear, Friendly, Professional', icon: '👩' },
                                        { name: 'Luna', desc: 'Energetic, Fast-paced, Gen-Z', icon: '👧' }
                                    ].map((v, i) => (
                                        <div key={v.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl">{v.icon}</div>
                                                <div>
                                                    <p className="font-bold text-white">{v.name}</p>
                                                    <p className="text-xs text-zinc-500">{v.desc}</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold text-blue-400">Play Sample</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Visual Style & Assets</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex flex-col gap-3">
                                        <span className="text-2xl text-blue-400">🏞️</span>
                                        <p className="font-bold text-white">Stock Footage</p>
                                        <p className="text-[10px] text-zinc-500">Auto-match scenes with 4K premium clips</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-zinc-800/50 border border-white/5 flex flex-col gap-3 opacity-50">
                                        <span className="text-2xl text-zinc-400">🎨</span>
                                        <p className="font-bold text-white">AI Art (DALL-E 3)</p>
                                        <p className="text-[10px] text-zinc-500">Generate unique images for every scene</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in text-center py-12">
                                <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
                                    🎬
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Complete Your Production</h3>
                                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
                                    Everything looks perfect. Clicking generate will consume 5 credits and start your AI video automation.
                                </p>
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5">
                            <button onClick={() => setStep(Math.max(1, step - 1))} className={`text-xs font-bold text-zinc-500 hover:text-white transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>BACK</button>
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className="px-10 py-3 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'INITIATING...' : step === 4 ? 'GENERATE VIDEO ✨' : 'CONTINUE →'}
                            </button>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-sm font-bold text-white tracking-widest uppercase animate-pulse">Building your story...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
