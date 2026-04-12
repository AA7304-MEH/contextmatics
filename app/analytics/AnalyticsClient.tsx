"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import { useVideo } from '@/context/VideoContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { PageLayout } from '@/components/shared';
import { LayoutDashboard, Video, FileText, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function AnalyticsPage() {
    const { user } = useAuth();
    const { historyItems } = useHistory();
    const { videos } = useVideo();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

    if (!user) return null;

    // Derive format distribution from real history
    const formatCounts: Record<string, number> = {};
    historyItems.forEach(item => {
        formatCounts[item.format] = (formatCounts[item.format] || 0) + 1;
    });
    // Add video count to distribution
    if (videos.length > 0) {
        formatCounts['AI Video'] = videos.length;
    }

    const pieData = Object.entries(formatCounts).map(([name, value]) => ({ name, value }));
    
    // Fallback if no data yet
    const displayPieData = pieData.length > 0 ? pieData : [
        { name: 'No Data', value: 1 }
    ];

    const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

    // Calculate real activity and trends
    const getTrends = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const rangeInDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        
        const trendData = Array.from({ length: rangeInDays }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (rangeInDays - 1 - i));
            return {
                day: days[date.getDay()],
                dateStr: date.toISOString().split('T')[0],
                content: 0,
                videos: 0,
                remaining: user.credits_remaining || 0
            };
        });

        historyItems.forEach(item => {
            const dateStr = new Date(item.created_at || item.createdAt).toISOString().split('T')[0];
            const dayData = trendData.find(d => d.dateStr === dateStr);
            if (dayData) dayData.content++;
        });

        videos.forEach(v => {
            const dateStr = new Date(v.created_at).toISOString().split('T')[0];
            const dayData = trendData.find(d => d.dateStr === dateStr);
            if (dayData) dayData.videos++;
        });

        return trendData;
    };

    const analyticsData = getTrends();
    const dailyActivity = timeRange === '7d' ? analyticsData : analyticsData.filter((_, i) => i % (timeRange === '30d' ? 4 : 10) === 0);
    const creditTrend = dailyActivity.map(d => ({ day: d.day, remaining: d.remaining }));

    const totalContent = historyItems.length;
    const totalVideos = videos.length;
    const avgPerDay = ((totalContent + totalVideos) / (timeRange === '7d' ? 7 : 30)).toFixed(1);

    const summaryCards = [
        { label: 'Total Output', value: totalContent + totalVideos, change: '+100%', icon: <TrendingUp className="w-5 h-5 text-blue-400" />, positive: true },
        { label: 'AI Content', value: totalContent, change: '+100%', icon: <FileText className="w-5 h-5 text-purple-400" />, positive: true },
        { label: 'AI Videos', value: totalVideos, change: totalVideos > 0 ? '+100%' : '0%', icon: <Video className="w-5 h-5 text-emerald-400" />, positive: true },
        { label: 'Credit Balance', value: user.credits_remaining, change: 'Active', icon: <Zap className="w-5 h-5 text-amber-400" />, positive: true },
    ];

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 text-left">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <LayoutDashboard className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-white">Performance Analytics</h1>
                        </div>
                        <p className="text-lg text-zinc-500">Track your production velocity and credit utilization.</p>
                    </div>
                    <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl">
                        {(['7d', '30d', '90d'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${timeRange === range
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
                    {summaryCards.map((card, i) => (
                        <div key={card.label} className="card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl group hover:border-blue-500/30 transition-all rounded-[2rem]" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                    {card.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${card.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {card.change}
                                </span>
                            </div>
                            <p className="text-4xl font-black text-white tracking-tighter mb-1">{card.value}</p>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 animate-fade-in">
                    <div className="card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" /> Production Activity
                            </h3>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="day" stroke="#404040" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#404040" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 900 }}
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    />
                                    <Bar dataKey="content" name="AI Content" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={20} />
                                    <Bar dataKey="videos" name="AI Videos" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem]">
                        <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" /> Credit Consumption
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={creditTrend}>
                                    <defs>
                                        <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="day" stroke="#404040" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#404040" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 900 }}
                                    />
                                    <Area type="monotone" dataKey="remaining" name="Credits" stroke="#3B82F6" fill="url(#creditGradient)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem]">
                        <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest text-xs">Output Focus</h3>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={displayPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                        {displayPieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-6 justify-center">
                            {displayPieData.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    <span className="text-[10px] font-black uppercase text-zinc-500">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem]">
                        <h3 className="text-lg font-black text-white mb-8">Recent Creative Sessions</h3>
                        {historyItems.length === 0 && videos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[240px] text-zinc-600">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-2xl">📁</div>
                                <p className="font-bold text-sm tracking-widest uppercase">No productions yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {[...historyItems, ...videos].sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime()).slice(0, 10).map((item, i) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            {item.url ? '🎬' : (item.icon || '📝')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-white truncate">{item.title || item.prompt}</p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.format || 'AI Video'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
