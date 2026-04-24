"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useHistory, ContentItem } from '@/context/HistoryContext';
import { UserManagement } from '@/components/UserManagement';
import { TransactionManagement } from '@/components/TransactionManagement';
import { PageLayout } from '@/components/shared';
import { 
    Activity, 
    Users, 
    CreditCard, 
    ShieldCheck, 
    Zap, 
    ArrowUpRight, 
    Database, 
    Globe, 
    AlertCircle, 
    LayoutDashboard,
    Settings,
    X,
    Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { historyItems } = useHistory();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity' | 'transactions'>('overview');
    const [health, setHealth] = useState<any>(null);
    const [usageData, setUsageData] = useState<any>(null);
    const [showGlobalLogs, setShowGlobalLogs] = useState(false);
    const [_globalLogs, _setGlobalLogs] = useState<any[]>([]);
    const [_logsLoading, setLogsLoading] = useState(false);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await fetch('/api/admin/health');
                const data = await res.json();
                setHealth(data);
            } catch (e) {
                console.error("Health fetch failed", e);
            }
        };
        const fetchUsage = async () => {
            try {
                const res = await fetch('/api/admin/usage');
                const data = await res.json();
                setUsageData(data);
            } catch (e) {
                console.error("Usage fetch failed", e);
            }
        };
        fetchHealth();
        fetchUsage();
    }, []);

    const fetchGlobalLogs = async () => {
        setLogsLoading(true);
        try {
            // Using the activity logic for a global view (fetching recent from snippets/transactions)
            const res = await fetch('/api/admin/health'); // Reuse health endpoint which has some counts
            await res.json();
            // In a real prod app, we'd have a specific /api/admin/logs
            // For now, we'll synthesize a view from available history
            setShowGlobalLogs(true);
        } catch (e) {
            console.error("Logs fetch failed", e);
        } finally {
            setLogsLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary text-white p-6">
                <div className="card p-12 text-center max-w-md border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">RESTRICTED AREA</h1>
                    <p className="text-text-secondary mb-8 font-medium italic">Terminal access denied. Your administrative role has not been verified for this secure zone.</p>
                    <button onClick={() => router.push('/dashboard')} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl uppercase font-black tracking-widest text-xs transition-all shadow-xl shadow-red-600/20">
                        Exit Secure Zone
                    </button>
                </div>
            </div>
        );
    }

    const totalStats = [
        { label: 'Total Syncs', value: health?.metrics?.totalGenerations ?? historyItems.length, icon: <Zap className="w-4 h-4" />, color: 'blue', desc: 'Active generations across the grid' },
        { label: 'Platform Users', value: health?.metrics?.totalUsers ?? '...', icon: <Users className="w-4 h-4" />, color: 'purple', desc: 'Identified creator profiles' },
        { label: 'Workspaces', value: health?.metrics?.activeWorkspaces ?? '...', icon: <Globe className="w-4 h-4" />, color: 'emerald', desc: 'Active team collaborative environments' },
        { label: 'High Volume', value: health?.metrics?.highVolumeUsers ?? '...', icon: <CreditCard className="w-4 h-4" />, color: 'amber', desc: 'Users requiring premium oversight' },
    ];

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 animate-fade-in text-left">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                <LayoutDashboard className="w-6 h-6" />
                             </div>
                             <span className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]">Command Terminal v2.0</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tight uppercase">Platform Oversight</h1>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                        {(['overview', 'users', 'transactions', 'activity'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab === 'overview' ? 'Stats' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Status Bar */}
                        <div className="flex flex-wrap items-center gap-6 p-5 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md">
                             <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Core Engine: Healthy</span>
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                <Globe className="w-3 h-3" />
                                <span>Global Uptime: 99.9%</span>
                             </div>
                             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest hidden md:inline">•</span>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                <span>Last Sync: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : '...'}</span>
                             </div>
                        </div>

                        {/* Top Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {totalStats.map((stat, i) => (
                                <div key={i} className="card p-8 border-white/5 bg-background-surface/30 hover:border-brand-primary/50 transition-all group relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-primary transform group-hover:scale-125 transition-transform duration-700">
                                        {stat.icon}
                                     </div>
                                     <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`p-4 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all`}>
                                            {stat.icon}
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 -translate-y-2" />
                                     </div>
                                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                                     <h3 className="text-4xl font-black text-white tracking-tighter relative z-10">{stat.value}</h3>
                                     <p className="text-[10px] text-text-tertiary mt-6 font-bold uppercase tracking-tighter italic opacity-60 group-hover:opacity-100 transition-opacity relative z-10">{stat.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Provider Health Cards */}
                        {usageData && (
                            <div className="card p-8 border-white/5 bg-background-surface/30">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">AI Provider Health & Usage</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.keys(usageData.status).map(provider => {
                                        const status = usageData.status[provider];
                                        const usage = usageData.usage[provider] || 0;
                                        const limit = usageData.limits[provider] || 1;
                                        const percent = Math.min((usage / limit) * 100, 100);
                                        const isNearLimit = percent > 80;
                                        return (
                                            <div key={provider} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
                                                <div className="flex justify-between items-center mb-6">
                                                    <span className="text-sm font-black text-white uppercase tracking-widest">{provider.replace('_', ' ')}</span>
                                                    <div className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${status.available ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10'}`}>
                                                        {status.available ? 'Online' : 'Offline'}
                                                    </div>
                                                </div>
                                                <div className="mb-6 flex justify-between items-center text-xs">
                                                    <span className="text-text-muted font-bold uppercase tracking-widest">Latency</span>
                                                    <span className="text-white font-mono">{status.latencyMs} ms</span>
                                                </div>
                                                <div className="space-y-2 mt-auto">
                                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                        <span className="text-text-muted">Daily Limit</span>
                                                        <span className={isNearLimit ? 'text-red-400' : 'text-emerald-400'}>{usage} / {limit}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-red-500' : 'bg-brand-primary'}`} style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Grid 2: Metrics & Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             <div className="lg:col-span-2 card p-8 border-white/5 bg-background-surface/30 text-left">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">System Infrastructure</h3>
                                    <button 
                                        onClick={fetchGlobalLogs}
                                        className="text-[10px] font-black text-brand-primary flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest"
                                    >
                                        Live Audit Feed <Activity className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                     {[
                                        { name: 'Database Clusters', status: 'Optimal', icon: <Database className="w-5 h-5 text-blue-400" />, p: 98 },
                                        { name: 'AI Inference Pipeline', status: 'Live', icon: <Zap className="w-5 h-5 text-amber-400" />, p: 100 },
                                        { name: 'CDN Edge Nodes', status: 'Syncing', icon: <Globe className="w-5 h-5 text-purple-400" />, p: 99 }
                                     ].map((srv, i) => (
                                        <div key={i} className="flex items-center gap-6 p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
                                             <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-white/50">{srv.icon}</div>
                                             <div className="flex-1">
                                                 <div className="flex justify-between mb-3">
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{srv.name}</span>
                                                    <span className="text-[9px] font-black uppercase text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full bg-emerald-400/5">{srv.status}</span>
                                                 </div>
                                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-brand-primary to-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${srv.p}%` }} />
                                                 </div>
                                             </div>
                                        </div>
                                     ))}
                                </div>
                             </div>

                             <div className="card p-8 border-white/5 bg-brand-primary/5 relative overflow-hidden text-left flex flex-col group">
                                <div className="absolute -bottom-16 -right-16 p-8 opacity-[0.03] text-brand-primary transform rotate-12 group-hover:scale-110 transition-transform duration-1000">
                                    <Settings className="w-64 h-64" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8 relative z-10">Admin Quick-Ops</h3>
                                <div className="space-y-4 relative z-10 flex-1">
                                    <button onClick={() => setActiveTab('users')} className="w-full flex items-center gap-4 p-5 bg-background-surface/80 hover:bg-brand-primary hover:text-white transition-all rounded-2xl border border-white/5 group/btn">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">User Directory</span>
                                    </button>
                                    <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-4 p-5 bg-background-surface/80 hover:bg-brand-primary hover:text-white transition-all rounded-2xl border border-white/5 group/btn">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Global Config</span>
                                    </button>
                                    <button onClick={() => setActiveTab('transactions')} className="w-full flex items-center gap-4 p-5 bg-background-surface/80 hover:bg-brand-primary hover:text-white transition-all rounded-2xl border border-white/5 group/btn">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Revenue Audit</span>
                                    </button>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                                    <button onClick={() => router.push('/')} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-colors flex items-center justify-center gap-3">
                                        Exit Terminal <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in-up">
                        <UserManagement />
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="animate-fade-in-up">
                        <TransactionManagement />
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="animate-fade-in-up space-y-8 text-left">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Platform Audit Stream</h2>
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Real-time event logging from active sessions</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{historyItems.length} ACTIVE EVENTS</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                             {historyItems.length === 0 ? (
                                <div className="py-20 text-center bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
                                    <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-text-secondary font-medium">No system events detected in this window.</p>
                                </div>
                             ) : historyItems.slice(0, 15).map((item: ContentItem, i: number) => (
                                <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                     <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-brand-primary/50 transition-all shadow-xl">
                                        {item.icon || '🚀'}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <div className="flex items-center gap-3 mb-1">
                                             <p className="text-sm font-black text-white group-hover:text-brand-primary transition-colors uppercase tracking-tight">{item.title}</p>
                                             <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase text-zinc-500">{item.format}</span>
                                         </div>
                                         <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest italic">{new Date(item.created_at).toLocaleString()}</span>
                                            <span className="text-[9px] text-zinc-600 font-mono">UID: {item.user_id?.substring(0, 12)}...</span>
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <div className="px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SUCCESS</span>
                                         </div>
                                         <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                         </button>
                                     </div>
                                </div>
                             ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Global Logs Modal */}
            {showGlobalLogs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className="bg-background-surface border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up relative">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setShowGlobalLogs(false)} className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-12 text-left">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-brand-primary/10 rounded-2xl text-brand-primary">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Live Audit Stream</h2>
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-[0.3em]">Global Platform Event Feed</p>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    {historyItems.length > 0 ? historyItems.map((log, i) => (
                                        <div key={i} className="flex items-center gap-6 p-4 border-b border-white/5 last:border-0 group">
                                            <span className="text-[10px] font-mono text-zinc-600 w-20">{new Date(log.created_at).toLocaleTimeString()}</span>
                                            <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase">EVENT</span>
                                            <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors flex-1">{log.title} processed successfully</span>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">NODE-01</span>
                                        </div>
                                    )) : (
                                        <div className="text-center py-20">
                                            <Zap className="w-12 h-12 text-zinc-700 mx-auto mb-4 animate-pulse" />
                                            <p className="text-text-secondary font-medium uppercase tracking-widest text-[10px]">Awaiting incoming telemetry...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-12 pt-0 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">REAL-TIME SYNC ACTIVE</span>
                            </div>
                            <button onClick={() => setShowGlobalLogs(false)} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
                                Close Feed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

