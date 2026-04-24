'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
    Split, 
    Sparkles, 
    RefreshCw,
    Twitter,
    Linkedin,
    Send,
    Scale,
    Swords,
    BarChart3,
    Copy
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { apiClient } from '@/lib/api-client';

interface Variant {
    hook: string;
    body: string;
    angle: string;
}

interface ABTest {
    id: string;
    base_content: string;
    variant_a: Variant;
    variant_b: Variant;
    platforms: string[];
    created_at: string;
}

export default function ABTesting() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [tests, setTests] = useState<ABTest[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [baseContent, setBaseContent] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) loadTests();
    }, [user]);

    const loadTests = async () => {
        const { data } = await supabase
            .from('ab_tests')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data) setTests(data as ABTest[]);
    };

    const handleGenerate = async () => {
        if (!baseContent.trim()) return;
        setIsGenerating(true);
        try {
            const data = await apiClient('/api/ab-test/generate', {
                method: 'POST',
                body: JSON.stringify({ baseContent })
            }) as { test: ABTest };

            setTests(prev => [data.test, ...prev]);
            setSelectedId(data.test.id);
            setBaseContent('');
            showToast('A/B Split-Test Ready! ⚖️', 'success');
        } catch (err:any) {
            showToast(err.message || 'Generation failed', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const activeTest = tests.find(t => t.id === selectedId) || tests[0];

    return (
        <PageLayout>
            <SEO title="A/B Testing" description="Split-test your hooks and copy using AI-driven psychological angles." />
            
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="text-center space-y-4 pt-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
                        <Scale className="w-3 h-3" />
                        Psychological Split-Testing
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-white">Performance <span className="text-kinetic">Lab</span></h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Don't guess what converts. Test Logan vs Emotion. Logic vs Fear. Data-driven growth started here.
                    </p>
                </div>

                {/* Input Area */}
                <div className="card bg-[#121214] border-white/5 p-8 rounded-[3rem] shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <textarea 
                                value={baseContent}
                                onChange={e => setBaseContent(e.target.value)}
                                placeholder="Paste your core message or hook idea here..."
                                className="input py-4 px-6 min-h-[100px] resize-none pr-12"
                            />
                        </div>
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !baseContent.trim()}
                            className="btn btn-primary px-12 h-auto text-lg font-black tracking-tight gap-3 shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-violet-600 hover:bg-violet-500 border-none disabled:opacity-50"
                        >
                            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Split className="w-5 h-5" />}
                            Run Split Test
                        </button>
                    </div>
                </div>

                {tests.length > 0 ? (
                    <div className="space-y-12 animate-fade-in-up">
                        {/* Selected Test Detail */}
                        {activeTest && (
                            <div className="relative">
                                {/* Side-by-Side Comparison */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                                    <VariantCard 
                                        label="Variant A" 
                                        variant={activeTest.variant_a} 
                                        color="blue" 
                                    />
                                    <VariantCard 
                                        label="Variant B" 
                                        variant={activeTest.variant_b} 
                                        color="red" 
                                    />
                                </div>

                                {/* VS Badge */}
                                <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#0A0A0B] border border-white/10 rounded-full z-20 items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    <Swords className="w-8 h-8 text-white/20" />
                                </div>
                            </div>
                        )}

                        {/* History / Queue */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted px-2">History & Deployment Queue</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {tests.map((test) => (
                                    <button 
                                        key={test.id}
                                        onClick={() => setSelectedId(test.id)}
                                        className={`group text-left p-6 rounded-[2rem] border transition-all ${selectedId === test.id ? 'bg-violet-500/10 border-violet-500' : 'bg-[#121214] border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <BarChart3 className={`w-5 h-5 ${selectedId === test.id ? 'text-violet-400' : 'text-text-muted'}`} />
                                                <div className="flex items-center gap-1">
                                                    <Twitter className="w-3 h-3 text-white/20" />
                                                    <Linkedin className="w-3 h-3 text-white/20" />
                                                </div>
                                            </div>
                                            <p className="font-bold text-white text-sm line-clamp-2 shrink-0 h-10">{test.base_content}</p>
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-2 border-t border-white/5">
                                                <span className="text-text-muted">{new Date(test.created_at).toLocaleDateString()}</span>
                                                <span className={selectedId === test.id ? 'text-violet-400' : 'text-text-muted'}>Select Lab</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-8 card bg-zinc-900/30 border-dashed border-2 border-white/5 rounded-[3rem]">
                        <div className="w-24 h-24 bg-violet-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-violet-500/20 rotate-12">
                            <Scale className="w-12 h-12 text-violet-500" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-white">No active split-tests</h3>
                            <p className="text-text-secondary max-w-sm mx-auto">
                                Paste a content idea above and we'll generate two psychologically distinct variants to see what hits hardest.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

function VariantCard({ label, variant, color }: { label: string, variant: Variant, color: 'blue' | 'red' }) {
    const { showToast } = useToast();
    const borderClass = color === 'blue' ? 'border-blue-500/20' : 'border-red-500/20';
    const textClass = color === 'blue' ? 'text-blue-400' : 'text-red-400';
    const bgClass = color === 'blue' ? 'bg-blue-500/10' : 'bg-red-500/10';

    return (
        <div className={`card bg-[#121214] border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity`}>
                <Sparkles className={`w-32 h-32 ${textClass}`} />
            </div>

            <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className={`px-3 py-1 rounded-full ${bgClass} border ${borderClass} text-[10px] font-bold ${textClass} uppercase tracking-widest inline-flex items-center gap-2`}>
                            {variant.angle} Driven
                        </div>
                        <h4 className="text-xl font-black text-white">{label}</h4>
                    </div>
                    <button 
                        onClick={() => { navigator.clipboard.writeText(`${variant.hook}\n\n${variant.body}`); showToast(`${label} copied!`, 'success'); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-white transition-all"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-white font-black text-lg leading-tight border-l-4">
                        "{variant.hook}"
                    </div>
                    <p className="text-text-secondary leading-relaxed font-medium">
                        {variant.body}
                    </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                    <button className="flex-1 btn btn-secondary py-3 text-[10px] font-black uppercase tracking-widest">
                        Draft to Ayrshare
                    </button>
                    <button className="p-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
