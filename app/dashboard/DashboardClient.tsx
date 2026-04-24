"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createBrowserClient } from '@supabase/ssr';
import { Sparkles, Calendar as CalendarIcon, Clock, Twitter, Linkedin, Instagram, Play, Video } from 'lucide-react';
import { PageLayout, ChangelogModal } from '@/components/shared';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState({
        generatedThisMonth: 0,
        publishedThisMonth: 0,
        credits: 0,
        timeSavedHours: 0
    });
    
    const [recentSnippets, setRecentSnippets] = useState<any[]>([]);
    const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
    const [recentVideos, setRecentVideos] = useState<any[]>([]);
    const [isAyrshareConnected, setIsAyrshareConnected] = useState(false);
    const [socialHistory, setSocialHistory] = useState<any[]>([]);
    const [socialLoading, setSocialLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    useEffect(() => {
        if (!user) return;

        async function fetchDashboardData() {
            if (!user) return;
            setDataLoading(true);
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // Fetch Profile Stats
            const { data: profile } = await supabase.from('profiles').select('credits_remaining').eq('id', user.id).single();
            
            // Fetch Snippets this month
            const { count: snippetsCount } = await supabase
                .from('snippets')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', startOfMonth);

            const genCount = snippetsCount || 0;

            // Fetch Published Posts this month
            const { count: publishedCount } = await supabase
                .from('scheduled_posts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'published')
                .gte('created_at', startOfMonth);

            setStats({
                generatedThisMonth: genCount,
                publishedThisMonth: publishedCount || 0,
                credits: profile?.credits_remaining || 0,
                timeSavedHours: Math.round((genCount * 20) / 60)
            });

            // Fetch Recent Snippets
            const { data: snippets } = await supabase
                .from('snippets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            if (snippets) setRecentSnippets(snippets);

            // Fetch Upcoming Scheduled Posts
            const { data: posts } = await supabase
                .from('scheduled_posts')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'scheduled')
                .gt('scheduled_at', new Date().toISOString())
                .order('scheduled_at', { ascending: true })
                .limit(5);
            if (posts) setUpcomingPosts(posts);

            // Fetch Recent Videos
            const { data: vids } = await supabase
                .from('videos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(2);
            if (vids) setRecentVideos(vids);

            // Fetch Ayrshare Connection Status
            const { data: ws } = await supabase.from('workspaces').select('ayrshare_profile_key').eq('owner_id', user.id).limit(1);
            const connected = !!(ws && ws[0] && ws[0].ayrshare_profile_key);
            setIsAyrshareConnected(connected);

            if (connected) {
                fetchSocialHistory();
            }

            setDataLoading(false);
        }

        async function fetchSocialHistory() {
            setSocialLoading(true);
            try {
                const res = await fetch('/api/social/history');
                const data = await res.json();
                if (data && Array.isArray(data)) {
                    setSocialHistory(data.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch social history:", err);
            } finally {
                setSocialLoading(false);
            }
        }

        fetchDashboardData();
    }, [user, supabase]);

    if (loading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        if (typeof window !== 'undefined') router.replace('/sign-in');
        return null;
    }

    const quickActions = [
        { label: 'Write a Post', icon: '📝', path: '/content-creator' },
        { label: 'Repurpose Content', icon: '🔄', path: '/video-repurpose' }, // Adjust if separate repurpose text page
        { label: 'Schedule Posts', icon: '📅', path: '/calendar' },
        { label: 'Open Calendar', icon: '🗓️', path: '/calendar' },
        { label: 'Video Generator', icon: '🎬', path: '/video-generator' },
        { label: 'Logo Maker', icon: '✨', path: '/logo-maker' },
    ];

    const getCreditsColor = (credits: number) => {
        if (credits === 0) return 'text-red-500 border-red-500/20 bg-red-500/10';
        if (credits < 50) return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
        return 'text-brand-primary border-brand-primary/20 bg-brand-primary/10';
    };

    const getPlatformIcon = (platform: string) => {
        switch(platform?.toLowerCase()) {
            case 'twitter': return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
            case 'linkedin': return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
            case 'instagram': return <Instagram className="w-5 h-5 text-[#E1306C]" />;
            default: return <Sparkles className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <PageLayout>
            <ChangelogModal />
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Creator HQ</h1>
                        <p className="text-text-secondary">Your AI command center.</p>
                    </div>
                </div>

                {/* Top Stat Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                        <div className="text-text-secondary text-sm font-medium mb-2">Content generated this month</div>
                        <div className="text-4xl font-bold">{stats.generatedThisMonth}</div>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                        <div className="text-text-secondary text-sm font-medium mb-2">Posts published this month</div>
                        <div className="text-4xl font-bold">{stats.publishedThisMonth}</div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${getCreditsColor(stats.credits)}`}>
                        <div className="text-sm font-medium mb-2 opacity-80">Credits remaining</div>
                        <div className="text-4xl font-bold flex items-center justify-between">
                            {stats.credits}
                            {stats.credits === 0 && (
                                <button onClick={() => router.push('/pricing')} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full transition">Upgrade</button>
                            )}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                        <div className="text-text-secondary text-sm font-medium mb-2">Time saved estimate</div>
                        <div className="text-4xl font-bold text-emerald-400">{stats.timeSavedHours} <span className="text-lg text-emerald-400/60 font-medium">hrs</span></div>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {quickActions.map(action => (
                        <button
                            key={action.label}
                            onClick={() => router.push(action.path)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex-1 min-w-[150px] justify-center text-sm font-medium"
                        >
                            <span>{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Wider) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Generations */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-brand-primary" />
                                    Recent Generations
                                </h2>
                                <button onClick={() => router.push('/snippets')} className="text-xs text-brand-primary hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {recentSnippets.length === 0 ? (
                                    <div className="text-center py-6 text-text-secondary text-sm">No generations yet. Create your first piece!</div>
                                ) : recentSnippets.map(snippet => (
                                    <div key={snippet.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/10 transition">
                                        <div className="pt-1">{getPlatformIcon(snippet.platform)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{snippet.title || snippet.content?.substring(0, 50)}</p>
                                            <p className="text-xs text-text-secondary mt-1 truncate">{snippet.content}</p>
                                            <p className="text-[10px] text-text-secondary mt-2 opacity-60">
                                                {new Date(snippet.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button onClick={() => router.push('/content-creator')} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 hover:bg-white/5 transition flex-shrink-0">
                                            Use again
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Videos */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Video className="w-5 h-5 text-purple-400" />
                                    Recent Videos
                                </h2>
                                <button onClick={() => router.push('/studio')} className="text-xs text-brand-primary hover:underline">Studio Overview</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentVideos.length === 0 ? (
                                    <div className="col-span-2 text-center py-6 text-text-secondary text-sm">No videos generated yet.</div>
                                ) : recentVideos.map(video => (
                                    <div key={video.id} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                        {video.thumbnail_url ? (
                                            <img src={video.thumbnail_url} alt="Video thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">No Thumbnail</div>
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition p-4 text-center">
                                            <button onClick={() => router.push('/video-editor')} className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-lg">
                                                <Play className="w-4 h-4 fill-current" />
                                                Continue Editing
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs text-white">
                                            <span className="bg-black/60 px-2 py-1 rounded truncate flex-1 mr-2">{video.prompt || 'Untitled Video'}</span>
                                            <span className="bg-black/60 px-2 py-1 rounded shrink-0">{new Date(video.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Narrower) */}
                    <div className="space-y-8">
                        {/* Upcoming Scheduled Posts */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-emerald-400" />
                                    Upcoming
                                </h2>
                                <button onClick={() => router.push('/calendar')} className="text-xs text-brand-primary hover:underline">Calendar</button>
                            </div>
                            <div className="space-y-3">
                                {upcomingPosts.length === 0 ? (
                                     <div className="text-center py-6 text-text-secondary text-sm">Your queue is empty.</div>
                                ) : upcomingPosts.map(post => (
                                    <div key={post.id} className="p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/10 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex gap-1">
                                                {post.platforms?.map((p: string) => (
                                                    <span key={p} className="opacity-80 scale-75 origin-left">{getPlatformIcon(p)}</span>
                                                ))}
                                            </div>
                                            <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-secondary line-clamp-2">{post.content}</p>
                                        <p className="text-xs text-text-secondary mt-2 opacity-60">
                                            {new Date(post.scheduled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Performance Strip */}
                        <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black overflow-hidden relative group">
                            <div className="absolute -top-12 -right-12 p-8 opacity-10 text-brand-primary group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="w-48 h-48" />
                            </div>
                            <h2 className="text-lg font-bold mb-4 relative z-10">Social Performance</h2>
                            {isAyrshareConnected ? (
                                <div className="space-y-4 relative z-10">
                                    <div className="text-sm text-text-secondary mb-2 uppercase tracking-widest text-[10px] font-bold">Latest post metrics</div>
                                    {socialLoading ? (
                                        <div className="py-12 flex flex-col items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Syncing Analytics...</span>
                                        </div>
                                    ) : socialHistory.length > 0 ? (
                                        socialHistory.map((post, i) => (
                                            <div key={post.id || i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group/item">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                                        {getPlatformIcon(post.platform?.[0] || 'social')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-white truncate max-w-[140px]">{post.post || 'Social Post'}</div>
                                                        <div className="text-[10px] text-text-tertiary uppercase font-medium">{new Date(post.created_at || post.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-brand-primary flex gap-4 font-black">
                                                    {post.analytics?.likes !== undefined && <span className="flex items-center gap-1">❤️ {post.analytics.likes}</span>}
                                                    {post.analytics?.shares !== undefined && <span className="flex items-center gap-1">🔄 {post.analytics.shares}</span>}
                                                    {post.analytics?.clicks !== undefined && <span className="flex items-center gap-1">🖱️ {post.analytics.clicks}</span>}
                                                    {!post.analytics && <span className="text-[10px] text-zinc-600 uppercase">Live</span>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-xs text-text-secondary italic">No social activity logged yet.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-6 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Linkedin className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-text-secondary mb-6 font-medium">Connect your accounts to see real-time growth stats and engagement metrics.</p>
                                    <button 
                                        onClick={() => router.push('/settings')} 
                                        className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                                    >
                                        Link Accounts
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </PageLayout>
    );
}
