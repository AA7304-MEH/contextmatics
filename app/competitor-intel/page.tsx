'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
    Activity, 
    TrendingUp, 
    Users, 
    Plus, 
    Twitter, 
    Zap,
    Heart,
    MessageCircle,
    ArrowUpRight
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function CompetitorIntel() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [_isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newComp, setNewComp] = useState({ name: '', handle: '', platform: 'Twitter' });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) {
            loadCompetitors();
        }
    }, [user]);

    const loadCompetitors = async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error: _error } = await supabase
            .from('competitors')
            .select('*')
            .eq('user_id', user.id);
        
        if (data) setCompetitors(data);
        setIsLoading(false);
    };

    const handleAdd = async () => {
        if (!user || !newComp.handle || !newComp.name) return;
        
        const { data, error } = await supabase
            .from('competitors')
            .insert({
                user_id: user.id,
                ...newComp
            })
            .select()
            .single();

        if (error) {
            showToast('Failed to add competitor', 'error');
            return;
        }

        setCompetitors([...competitors, data]);
        setNewComp({ name: '', handle: '', platform: 'Twitter' });
        setIsAdding(false);
        showToast('Competitor added! Syncing data...', 'success');
        
        // Trigger sync
        syncCompetitor(data.id);
    };

    const syncCompetitor = async (id: string) => {
        try {
            const res = await fetch('/api/competitor/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competitorId: id })
            });
            if (res.ok) {
                showToast('Sync complete!', 'success');
                loadCompetitors();
            }
        } catch (err) {
            console.error('Sync failed:', err);
        }
    };

    const mockChartData = [
        { name: 'Mon', engagement: 400 },
        { name: 'Tue', engagement: 300 },
        { name: 'Wed', engagement: 600 },
        { name: 'Thu', engagement: 800 },
        { name: 'Fri', engagement: 500 },
        { name: 'Sat', engagement: 900 },
        { name: 'Sun', engagement: 700 },
    ];

    return (
        <PageLayout>
            <SEO title="Competitor Intelligence" description="Monitor your competitors and reverse-engineer their success." />
            
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
                            Competitor <span className="text-kinetic">Intelligence</span>
                            <Activity className="w-6 h-6 text-brand-primary" />
                        </h1>
                        <p className="text-text-secondary">Track, analyze, and out-perform your competition.</p>
                    </div>

                    <button 
                        onClick={() => setIsAdding(true)}
                        className="btn btn-primary py-3 px-6 font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                        <Plus className="w-4 h-4" /> Add Competitor
                    </button>
                </div>

                {/* Add Competitor Modal Placeholder/Form */}
                {isAdding && (
                    <div className="animate-fade-in card bg-zinc-900 border-white/10 p-8 space-y-6">
                        <h3 className="text-xl font-bold text-white">Add New Competitor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Display Name</label>
                                <input 
                                    type="text" 
                                    value={newComp.name}
                                    onChange={e => setNewComp({...newComp, name: e.target.value})}
                                    placeholder="e.g., Alex Hormozi"
                                    className="input py-2.5 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Handle</label>
                                <input 
                                    type="text" 
                                    value={newComp.handle}
                                    onChange={e => setNewComp({...newComp, handle: e.target.value})}
                                    placeholder="@ahormozi"
                                    className="input py-2.5 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Platform</label>
                                <select 
                                    value={newComp.platform}
                                    onChange={e => setNewComp({...newComp, platform: e.target.value})}
                                    className="input py-2.5 text-sm"
                                >
                                    <option>Twitter</option>
                                    <option>LinkedIn</option>
                                    <option>Instagram</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsAdding(false)} className="btn btn-secondary px-6">Cancel</button>
                            <button onClick={handleAdd} className="btn btn-primary px-8">Save & Sync</button>
                        </div>
                    </div>
                )}

                {/* Competition Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar: Tracked Competitors */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Monitoring ({competitors.length})</h3>
                            <button className="text-[10px] font-bold text-brand-primary hover:underline">Sync All</button>
                        </div>
                        
                        <div className="space-y-3">
                            {competitors.map((comp) => (
                                <div key={comp.id} className="group glass-panel p-4 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-white text-sm">
                                            {comp.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{comp.name}</p>
                                            <p className="text-[10px] text-text-muted uppercase">{comp.platform} • {comp.handle}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-400">+{comp.stats?.engagement_rate ? Math.floor(comp.stats.engagement_rate) : '--'}%</p>
                                        <p className="text-[9px] text-text-muted uppercase">Engagement</p>
                                    </div>
                                </div>
                            ))}

                            {competitors.length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                    <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                    <p className="text-xs text-text-muted">No competitors added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content: Deep Insights */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Benchmarking Chart */}
                        <div className="card p-6 border-brand-primary/10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    Engagement Benchmarking
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> Competitor Avg</div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> You</div>
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockChartData}>
                                        <defs>
                                            <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="engagement" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEng)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Performing Content Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest px-2">Hottest Posts (Last 7 Days)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="glass-panel p-5 space-y-4 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Alex Hormozi • 2h ago</span>
                                            </div>
                                            <Zap className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <p className="text-sm text-text-primary leading-relaxed line-clamp-3">
                                            The secret to scaling is simple: Do the boring stuff for longer than anyone else is willing to. Most people quit right before the breakout.
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5 text-xs text-text-secondary"><Heart className="w-3.5 h-3.5" /> 1.2k</span>
                                                <span className="flex items-center gap-1.5 text-xs text-text-secondary"><MessageCircle className="w-3.5 h-3.5" /> 84</span>
                                            </div>
                                            <button className="flex items-center gap-1 text-[10px] font-bold text-brand-primary uppercase hover:underline">
                                                Reverse Engineer <ArrowUpRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
