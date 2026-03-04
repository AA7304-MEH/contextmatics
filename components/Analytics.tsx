import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { PageLayout } from './shared';

const Analytics: React.FC = () => {
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

    // Mock credit usage trend (in production, from API)
    const creditTrend = [
        { day: 'Mon', used: 3, remaining: 47 },
        { day: 'Tue', used: 5, remaining: 42 },
        { day: 'Wed', used: 2, remaining: 40 },
        { day: 'Thu', used: 4, remaining: 36 },
        { day: 'Fri', used: 8, remaining: 28 },
        { day: 'Sat', used: 1, remaining: 27 },
        { day: 'Sun', used: 3, remaining: 24 },
    ];

    // Mock daily activity
    const dailyActivity = [
        { day: 'Mon', content: 2, videos: 1 },
        { day: 'Tue', content: 4, videos: 2 },
        { day: 'Wed', content: 1, videos: 0 },
        { day: 'Thu', content: 3, videos: 3 },
        { day: 'Fri', content: 6, videos: 2 },
        { day: 'Sat', content: 2, videos: 1 },
        { day: 'Sun', content: 1, videos: 0 },
    ];

    const totalContent = historyItems.length || 15;
    const totalVideos = JSON.parse(localStorage.getItem('mock_videos') || '[]').length || 8;
    const avgPerDay = (totalContent / 7).toFixed(1);

    const summaryCards = [
        { label: 'Total Generations', value: totalContent + totalVideos, change: '+12%', icon: '📈', positive: true },
        { label: 'Content Pieces', value: totalContent, change: '+8%', icon: '📝', positive: true },
        { label: 'Videos Created', value: totalVideos, change: '+23%', icon: '🎬', positive: true },
        { label: 'Avg. Per Day', value: avgPerDay, change: '-2%', icon: '📊', positive: false },
    ];

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div className="container mx-auto px-6 py-12">

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
                        <div key={card.label} className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/50" style={{ animationDelay: `${i * 60}ms` }}>
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

                    {/* Daily Activity Bar Chart */}
                    <div className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/30">
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

                    {/* Credit Usage Area Chart */}
                    <div className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/30">
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

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">

                    {/* Format Distribution Pie */}
                    <div className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/30">
                        <h3 className="text-base font-semibold text-white mb-6">Content Format Distribution</h3>
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center">
                            {pieData.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Content */}
                    <div className="lg:col-span-2 card p-6 border border-white/5 bg-[var(--color-background-surface)]/30">
                        <h3 className="text-base font-semibold text-white mb-6">Recent Generations</h3>
                        {historyItems.length === 0 ? (
                            <div className="flex items-center justify-center h-[240px] text-[var(--color-text-secondary)]">
                                <p>No content generated yet. Start creating to see your activity!</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                                {historyItems.slice(0, 8).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-base shrink-0">{item.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{item.format}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === 'success' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Analytics;
