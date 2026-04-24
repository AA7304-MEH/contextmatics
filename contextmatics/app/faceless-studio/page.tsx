"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/shared';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mic, Layout, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function FacelessStudioPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { user, refreshProfile } = useAuth();
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('Storytelling');
    const [voice, setVoice] = useState('Marcus');
    const [assetsMode, setAssetsMode] = useState('Stock Footage');
    const [duration, _setDuration] = useState(30);

    const steps = [
        { id: 1, name: 'Script & Theme', icon: '📝' },
        { id: 2, name: 'AI Voice', icon: '🎙️' },
        { id: 3, name: 'Visual Assets', icon: '🎞️' },
        { id: 4, name: 'Review', icon: '✨' },
    ];

    const themes = ['Documentary', 'Storytelling', 'News', 'Explainer', 'Horror', 'Motivational'];
    const voices = [
        { name: 'Marcus', desc: 'Deep, Narrative, Authoritative', icon: '🧔' },
        { name: 'Sarah', desc: 'Clear, Friendly, Professional', icon: '👩' },
        { name: 'Luna', desc: 'Energetic, Fast-paced, Gen-Z', icon: '👧' }
    ];

    const nextStep = async () => {
        if (step < 4) {
            if (step === 1 && !topic.trim()) {
                showToast('Please describe your story topic', 'warning');
                return;
            }
            setStep(step + 1);
        } else {
            handleGenerate();
        }
    };

    const handleGenerate = async () => {
        if (!user || user.credits_remaining < 5) {
            showToast('Insufficient credits (requires 5 for Faceless Studio).', 'error');
            router.push('/pricing');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/faceless/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    style,
                    voice,
                    assetsMode,
                    duration,
                    platform: 'TikTok' // Defaulting for now
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Generation failed');

            showToast('Faceless production initiated! Check your projects.', 'success');
            await refreshProfile();
            
            // Redirect to the new project or studio
            setTimeout(() => {
                router.push(`/studio/${data.projectId}`);
            }, 1500);

        } catch (err:any) {
            showToast(err.message || 'Error starting production', 'error');
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 md:py-20 text-left">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                                Faceless Studio <Sparkles className="w-6 h-6 text-amber-500" />
                            </h1>
                            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Create Viral AI Automations</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-zinc-500">PRO FEATURE</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shadow-lg shadow-amber-500/5">👑</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-16 relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110' : 'bg-zinc-900 text-zinc-600 border border-white/5'}`}>
                                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-zinc-600'}`}>{s.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Content Box */}
                    <div className="card min-h-[480px] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-14 relative overflow-hidden group shadow-2xl rounded-[2.5rem]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50" />

                        {step === 1 && (
                            <div className="animate-fade-in space-y-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block">What is your story about?</label>
                                    <textarea 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. A mystery about the lost city of Atlantis with a dark twist..." 
                                        className="input h-40 text-white bg-white/5 border-white/10 p-6 rounded-[2rem] w-full focus:border-blue-500/50 transition-all text-lg leading-relaxed placeholder:text-zinc-700" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block">Video Narrative Theme</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {themes.map(t => (
                                            <button 
                                                key={t} 
                                                onClick={() => setStyle(t)}
                                                className={`p-4 rounded-2xl border transition-all text-sm font-bold ${style === t ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:border-white/20'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Mic className="w-6 h-6" /></div>
                                    <h3 className="text-2xl font-black text-white">Select AI Voice Artist</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {voices.map((v) => (
                                        <div 
                                            key={v.name} 
                                            onClick={() => setVoice(v.name)}
                                            className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all cursor-pointer ${voice === v.name ? 'bg-blue-600 text-white border-blue-400 shadow-xl' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="text-4xl bg-black/20 w-16 h-16 flex items-center justify-center rounded-2xl">{v.icon}</div>
                                                <div>
                                                    <p className={`font-black text-lg ${voice === v.name ? 'text-white' : 'text-white'}`}>{v.name}</p>
                                                    <p className={`text-xs ${voice === v.name ? 'text-blue-100' : 'text-zinc-500'}`}>{v.desc}</p>
                                                </div>
                                            </div>
                                            <button className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${voice === v.name ? 'bg-white text-blue-600' : 'text-blue-400 hover:bg-blue-400/10'}`}>PLAY SAMPLE</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500"><Layout className="w-6 h-6" /></div>
                                    <h3 className="text-2xl font-black text-white">Visual Style & Assets</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { name: 'Stock Footage', icon: '🏞️', desc: 'Auto-match scenes with 4K premium clips', active: true },
                                        { name: 'AI Art (DALL-E 3)', icon: '🎨', desc: 'Generate unique images for every scene', active: true },
                                        { name: 'Motion Graphics', icon: '📊', desc: 'Dynamic typography and shape animations', active: true },
                                        { name: 'Cinematic Noir', icon: '🌑', desc: 'High contrast black & white moody visuals', active: true }
                                    ].map(item => (
                                        <div 
                                            key={item.name}
                                            onClick={() => setAssetsMode(item.name)}
                                            className={`p-8 rounded-[2.5rem] border transition-all flex flex-col gap-4 text-left group/card cursor-pointer ${assetsMode === item.name ? 'bg-blue-600 border-blue-400 text-white shadow-2xl' : 'bg-white/5 border-white/5 hover:border-zinc-700'}`}
                                        >
                                            <span className="text-4xl group-hover/card:scale-110 transition-transform block">{item.icon}</span>
                                            <div>
                                                <p className="font-black text-lg">{item.name}</p>
                                                <p className={`text-xs leading-relaxed ${assetsMode === item.name ? 'text-blue-100' : 'text-zinc-500'}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in text-center py-12 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce shadow-2xl shadow-blue-500/20">
                                    🎬
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">Ready for Production</h3>
                                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-10 leading-relaxed">
                                    Everything looks perfect. Clicking generate will consume <span className="text-white font-bold">5 credits</span> and start your high-fidelity AI video automation.
                                </p>
                                
                                <div className="w-full max-w-md bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4 text-left">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-zinc-500 uppercase tracking-widest">Theme</span>
                                        <span className="text-white font-black">{style}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-zinc-500 uppercase tracking-widest">AI Voice</span>
                                        <span className="text-white font-black">{voice}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-zinc-500 uppercase tracking-widest">Visuals</span>
                                        <span className="text-white font-black">{assetsMode}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="mt-14 flex justify-between items-center pt-10 border-t border-white/5">
                            <button 
                                onClick={() => setStep(Math.max(1, step - 1))} 
                                className={`text-xs font-black tracking-widest text-zinc-500 hover:text-white transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                BACK
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className="group px-12 py-5 rounded-[1.5rem] bg-blue-600 text-sm font-black text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                {loading ? 'INITIATING ENGINE...' : step === 4 ? (
                                    <>START PRODUCTION <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                ) : 'CONTINUE PRODUCTION →'}
                            </button>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-6 animate-fade-in">
                                <div className="w-20 h-20 border-8 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-2xl shadow-blue-500/20" />
                                <div className="text-center">
                                    <p className="text-xl font-black text-white tracking-widest uppercase mb-2">Building your vision...</p>
                                    <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Encoding script & assigning actors</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
