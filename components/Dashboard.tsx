import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageLayout } from './shared';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { historyItems } = useHistory();
  const navigate = useNavigate();

  if (!user) return null;

  // Derive real stats from context
  const totalContentPieces = historyItems.length;
  const mockVideosRaw = JSON.parse(localStorage.getItem('mock_videos') || '[]');
  const totalVideos = mockVideosRaw.length;
  const creditsRemaining = user.processingCredits;
  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  // Mock weekly data (would come from analytics API in production)
  const weeklyData = [
    { name: 'Mon', snippets: 2, videos: 1 },
    { name: 'Tue', snippets: 4, videos: 0 },
    { name: 'Wed', snippets: 1, videos: 2 },
    { name: 'Thu', snippets: 3, videos: 1 },
    { name: 'Fri', snippets: 5, videos: 3 },
    { name: 'Sat', snippets: 2, videos: 1 },
    { name: 'Sun', snippets: 1, videos: 0 },
  ];

  const stats = [
    { label: 'Credits Left', value: creditsRemaining >= 999999 ? '∞' : creditsRemaining, color: 'blue', icon: '⚡' },
    { label: 'Content Created', value: totalContentPieces, color: 'violet', icon: '📝' },
    { label: 'Videos Generated', value: totalVideos, color: 'emerald', icon: '🎬' },
    { label: 'Current Plan', value: planLabel, color: 'amber', icon: '👑' },
  ];

  const quickActions = [
    { label: 'Create Content', desc: 'AI-powered text generation', icon: '✨', path: '/content-creator', gradient: 'from-blue-600 to-cyan-500' },
    { label: 'Generate Video', desc: 'Text to video in seconds', icon: '🎬', path: '/video-generator', gradient: 'from-violet-600 to-purple-500' },
    { label: 'Faceless Studio', desc: 'AI faceless video creator', icon: '🎞️', path: '/faceless-studio', gradient: 'from-indigo-600 to-violet-500' },
    { label: 'Repurpose Video', desc: 'Transform existing videos', icon: '🔄', path: '/video-repurpose', gradient: 'from-emerald-600 to-teal-500' },
    { label: 'Video Editor', desc: 'Edit and polish videos', icon: '✂️', path: '/video-editor', gradient: 'from-orange-600 to-red-500' },
    { label: 'Templates', desc: 'Pre-built prompt library', icon: '📚', path: '/templates', gradient: 'from-pink-600 to-rose-500' },
    { label: 'Analytics', desc: 'Usage insights & trends', icon: '📊', path: '/analytics', gradient: 'from-indigo-600 to-blue-500' },
  ];

  const recentItems = historyItems.slice(0, 5);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <div className="container mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''} 👋
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Here's your creative workspace overview.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/50 hover:border-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-bold uppercase tracking-widest text-${stat.color}-400 opacity-60`}>
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[var(--color-background-surface)]/50 p-6 text-left transition-all duration-300 hover:border-white/15 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{action.icon}</span>
                  <h3 className="text-base font-semibold text-white mb-1">{action.label}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{action.desc}</p>
                </div>
                <svg className="absolute bottom-4 right-4 w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-6">Usage Overview</h2>
          <div className="card p-6 border border-white/5 bg-[var(--color-background-surface)]/30 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#525252"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="snippets" name="Snippets" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="videos" name="Videos" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">Recent Activity</h2>
            {recentItems.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                View All →
              </button>
            )}
          </div>

          {recentItems.length === 0 ? (
            <div className="card p-12 border border-white/5 bg-[var(--color-background-surface)]/30 text-center">
              <span className="text-4xl mb-4 block">🚀</span>
              <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">Start creating content or generating videos to see your activity here.</p>
              <button
                onClick={() => navigate('/content-creator')}
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-violet-600 border-none px-6"
              >
                Create Your First Piece ✨
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="card group p-5 border border-white/5 bg-[var(--color-background-surface)]/50 flex items-center justify-between gap-4 hover:border-white/10 transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {item.format} · {getTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'success'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-red-400 bg-red-500/10 border-red-500/20'
                      }`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => navigate('/history')}
                      className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  );
};

export default Dashboard;
