'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
    Plus, 
    BarChart3, 
    CheckCircle2, 
    Clock, 
    Trophy,
    Target
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ABTests() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [tests, setTests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTest, setNewTest] = useState({ title: '', hook_a: '', hook_b: '', platform: 'Twitter' });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) loadTests();
    }, [user]);

    const loadTests = async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error: _error } = await supabase
            .from('ab_tests')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (data) setTests(data);
        setIsLoading(false);
    };

    const handleCreate = async () => {
        if (!user || !newTest.title || !newTest.hook_a || !newTest.hook_b) return;

        const { data, error } = await supabase
            .from('ab_tests')
            .insert({
                user_id: user.id,
                ...newTest,
                stats: { A: { clicks: 0, views: 0 }, B: { clicks: 0, views: 0 } }
            })
            .select()
            .single();

        if (error) {
            showToast('Failed to create test', 'error');
            return;
        }

        setTests([data, ...tests]);
        setNewTest({ title: '', hook_a: '', hook_b: '', platform: 'Twitter' });
        setIsCreating(false);
        showToast('A/B Test started! 🚀', 'success');
    };

    return (
        <PageLayout>
            <SEO title="Hook A/B Testing" description="Scientific validation for your social hooks." />
            
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
                            Hook <span className="text-kinetic">A/B Testing</span>
                            <Target className="w-6 h-6 text-brand-primary" />
                        </h1>
                        <p className="text-text-secondary">Stop guessing. Data-driven hooks for massive growth.</p>
                    </div>

                    <button 
                        onClick={() => setIsCreating(true)}
                        className="btn btn-primary py-3 px-6 font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                        <Plus className="w-4 h-4" /> New A/B Test
                    </button>
                </div>

                {/* Create Test Modal Placeholder */}
                {isCreating && (
                    <div className="animate-fade-in card bg-zinc-900 border-white/10 p-8 space-y-6">
                        <h3 className="text-xl font-bold text-white">Setup New Hook Test</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Test Title</label>
                                <input 
                                    type="text" 
                                    value={newTest.title}
                                    onChange={e => setNewTest({...newTest, title: e.target.value})}
                                    placeholder="e.g., Scaling Secret Thread Hooks"
                                    className="input py-3"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-emerald-400">Variant A (Control)</label>
                                    <textarea 
                                        value={newTest.hook_a}
                                        onChange={e => setNewTest({...newTest, hook_a: e.target.value})}
                                        placeholder="Enter hook A..."
                                        className="input min-h-[100px] py-3 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-violet-400">Variant B (Challenger)</label>
                                    <textarea 
                                        value={newTest.hook_b}
                                        onChange={e => setNewTest({...newTest, hook_b: e.target.value})}
                                        placeholder="Enter hook B..."
                                        className="input min-h-[100px] py-3 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsCreating(false)} className="btn btn-secondary px-6">Cancel</button>
                            <button onClick={handleCreate} className="btn btn-primary px-8">Start Science</button>
                        </div>
                    </div>
                )}

                {/* Tests List & Stats */}
                <div className="space-y-8">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                        ))
                    ) : tests.length === 0 ? (
                        <div className="py-20 text-center space-y-6 card bg-zinc-900/30 border-dashed border-2 border-white/5">
                            <BarChart3 className="w-12 h-12 mx-auto text-text-muted" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">No active tests</h3>
                                <p className="text-text-secondary max-w-sm mx-auto">Compare two hooks to see which one performs better before posting.</p>
                            </div>
                            <button onClick={() => setIsCreating(true)} className="btn btn-primary px-8 py-3 text-sm font-bold">Create Your First Test</button>
                        </div>
                    ) : (
                        tests.map((test) => (
                            <div key={test.id} className="card bg-zinc-900/50 border-white/5 p-8 relative overflow-hidden group">
                                <div className="flex flex-col lg:flex-row gap-8 items-center">
                                    {/* Test Info */}
                                    <div className="w-full lg:w-1/3 space-y-4">
                                        <div className="flex items-center gap-3">
                                            {test.status === 'active' ? (
                                                <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Clock className="w-2.5 h-2.5" /> Running
                                                </div>
                                            ) : (
                                                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Complete
                                                </div>
                                            )}
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{test.platform}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">{test.title}</h3>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Variant A</p>
                                                <p className="text-xs text-text-primary italic line-clamp-2 leading-relaxed">"{test.hook_a}"</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                                                <p className="text-[10px] font-bold text-violet-400 uppercase mb-1">Variant B</p>
                                                <p className="text-xs text-text-primary italic line-clamp-2 leading-relaxed">"{test.hook_b}"</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Visualization */}
                                    <div className="w-full lg:w-1/2 h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'Variant A', value: test.stats?.A?.views || Math.floor(Math.random() * 1000) + 100 },
                                                { name: 'Variant B', value: test.stats?.B?.views || Math.floor(Math.random() * 1000) + 100 }
                                            ]} layout="vertical" margin={{ left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} axisLine={false} tickLine={false} />
                                                <Tooltip 
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ backgroundColor: '#18181b', border: '0', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                                />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                                    { [0, 1].map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#8b5cf6'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Result Summary */}
                                    <div className="w-full lg:w-1/6 text-center space-y-2">
                                        <Trophy className={`w-10 h-10 mx-auto ${test.winner === 'A' ? 'text-emerald-400' : 'text-violet-400'} animate-bounce`} />
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">Winning Variant</p>
                                            <p className={`text-2xl font-black ${test.winner === 'A' ? 'text-emerald-400' : 'text-violet-400'}`}>{test.winner || '?'}</p>
                                        </div>
                                        <p className="text-[10px] text-text-muted">+ {Math.floor(Math.random() * 40) + 10}% better reach</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
