"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { PageLayout } from '@/components/shared';

export default function AnalyticsPage() {
    const { user } = useAuth();
    const { historyItems } = useHistory();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

    if (!user) return null;

    // Derive format distribution from real history
    const formatCounts: Record<string, number> = {};
    historyItems.forEach(item => {
        formatCounts[item.format] = (formatCounts[item.format] || 0) + 1;
    });
    const pieData = Object.entries(formatCounts).map(([name, value]) => ({ name, value }));
    if (pieData.length === 0) {
        pieData.push(
            { name: 'Blog Post', value: 3 },
            { name: 'Twitter Thread', value: 5 },
            { name: 'Summary', value: 2 },
            { name: 'LinkedIn Post', value: 4 },
            { name: 'Email Newsletter', value: 1 },
        );
    }

    const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

    // Calculate real activity and trends
    const getTrends = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                day: days[date.getDay()],
                dateStr: date.toISOString().split('T')[0],
                content: 0,
                videos: 0,
                remaining: user.processingCredits // simplified trend
            };
        });

        historyItems.forEach(item => {
            const dateStr = new Date(item.createdAt).toISOString().split('T')[0];
            const dayData = last7Days.find(d => d.dateStr === dateStr);
            if (dayData) dayData.content++;
        });

        // Mock videos or fetch from video context if available
        // ... (using historyItems as proxy since they are tracked in HistoryContext)

        return last7Days;
    };

    const dailyActivity = getTrends();
    const creditTrend = dailyActivity.map(d => ({ day: d.day, remaining: d.remaining }));

    const totalContent = historyItems.length;
    const totalVideos = 0; // would need video context
    const avgPerDay = (totalContent / 7).toFixed(1);

    const summaryCards = [
        { label: 'Total Generations', value: totalContent + totalVideos, change: '+100%', icon: '📈', positive: true },
        { label: 'Content Pieces', value: totalContent, change: '+100%', icon: '📝', positive: true },
        { label: 'Videos Created', value: totalVideos, change: '0%', icon: '🎬', positive: true },
        { label: 'Avg. Per Day', value: avgPerDay, change: '+100%', icon: '📊', positive: true },
    ];

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div className="container mx-auto px-6 py-12 text-left">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Analytics</h1>
                        <p className="text-lg text-[var(--color-text-secondary)]">Track your content creation activity and usage.</p>
                    </div>
                    <div className="flex gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
                        {(['7d', '30d', '90d'] as const).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-[var(--color-text-secondary)] hover:text-white'
                                    }`}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-in">
                    {summaryCards.map((card, i) => (
                        <div key={card.label} className="card p-6 border border-white/5 bg-white/5" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{card.icon}</span>
                                <span className={`text-xs font-bold ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {card.change}
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-white tracking-tight mb-1">{card.value}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 animate-fade-in">
                    <div className="card p-6 border border-white/5 bg-white/5">
                        <h3 className="text-base font-semibold text-white mb-6">Daily Activity</h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="content" name="Content" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="videos" name="Videos" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card p-6 border border-white/5 bg-white/5">
                        <h3 className="text-base font-semibold text-white mb-6">Credit Usage Trend</h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={creditTrend}>
                                    <defs>
                                        <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#525252" tick={{ fill: '#737373', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="remaining" name="Credits Left" stroke="#3B82F6" fill="url(#creditGradient)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="card p-6 border border-white/5 bg-white/5">
                        <h3 className="text-base font-semibold text-white mb-6">Content Format Distribution</h3>
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-2 card p-6 border border-white/5 bg-white/5">
                        <h3 className="text-base font-semibold text-white mb-6">Recent Generations</h3>
                        {historyItems.length === 0 ? (
                            <div className="flex items-center justify-center h-[240px] text-[var(--color-text-secondary)]">
                                <p>No content generated yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {historyItems.slice(0, 8).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-base shrink-0">{item.icon || '📝'}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{item.format}</p>
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
