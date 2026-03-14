import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { UserManagement } from './UserManagement';
import { PageLayout } from './shared';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { historyItems } = useHistory();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity'>('overview');

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-text-muted mb-8">You do not have permission to view this page.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                    >
                        Go to User Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Dynamic stats from context
    const totalProductions = historyItems.length;
    const creditsUsed = user.processingCredits;
    const successRate = totalProductions > 0
        ? Math.round((historyItems.filter(i => i.status === 'success').length / totalProductions) * 100)
        : 100;

    // Recent activity from history
    const recentActivity = historyItems.slice(0, 8);

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-12">
                    <div className="mb-0">
                        <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">
                            Admin Console
                        </h1>
                        <p className="text-lg text-text-secondary">
                            System overview, user management, and activity log.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {(['overview', 'users', 'activity'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab
                                    ? 'bg-white text-black'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab === 'overview' ? 'Overview' : tab === 'users' ? 'User Management' : 'Activity Log'}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="animate-fade-in space-y-8">
                        {/* Dynamic Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="card p-6 border-blue-500/20 bg-blue-500/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Total Productions</h3>
                                <p className="text-4xl font-bold text-white mb-1">{totalProductions}</p>
                                <p className="text-sm text-blue-300/60">All-time generated content</p>
                            </div>
                            <div className="card p-6 border-emerald-500/20 bg-emerald-500/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Credits Remaining</h3>
                                <p className="text-4xl font-bold text-white mb-1">{creditsUsed}</p>
                                <p className="text-sm text-emerald-300/60">Available processing credits</p>
                            </div>
                            <div className="card p-6 border-purple-500/20 bg-purple-500/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-2">Success Rate</h3>
                                <p className="text-4xl font-bold text-white mb-1">{successRate}%</p>
                                <p className="text-sm text-purple-300/60">Generation accuracy</p>
                            </div>
                            <div className="card p-6 border-amber-500/20 bg-amber-500/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Current Plan</h3>
                                <p className="text-4xl font-bold text-white mb-1 capitalize">{user.plan}</p>
                                <p className="text-sm text-amber-300/60">{user.role} account</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card p-8 border border-white/10 bg-background-surface/50">
                            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                            <div className="flex gap-4 flex-wrap">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="btn btn-secondary"
                                >
                                    👥 Manage Users
                                </button>
                                <button
                                    onClick={() => navigate('/subscription')}
                                    className="btn btn-secondary"
                                >
                                    💳 View Subscriptions
                                </button>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="btn btn-secondary"
                                >
                                    ⚙️ App Settings
                                </button>
                                <button
                                    onClick={() => navigate('/analytics')}
                                    className="btn btn-secondary"
                                >
                                    📊 View Analytics
                                </button>
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className="btn btn-secondary"
                                >
                                    📋 Activity Log
                                </button>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="card p-8 border border-white/10 bg-background-surface/50">
                            <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-bold text-white">API Services</p>
                                        <p className="text-xs text-emerald-400">All systems operational</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Database</p>
                                        <p className="text-xs text-emerald-400">Connected & responsive</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-bold text-white">AI Engine</p>
                                        <p className="text-xs text-emerald-400">Gemini Pro ready</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <UserManagement />
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                            <span className="text-xs text-text-muted">{recentActivity.length} entries</span>
                        </div>
                        {recentActivity.length === 0 ? (
                            <div className="card p-12 text-center border border-white/5">
                                <p className="text-4xl mb-4">📋</p>
                                <p className="text-text-muted">No activity yet. Generate some content to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="card p-4 border border-white/5 bg-white/[0.02] flex items-center gap-4 hover:bg-white/5 transition-all">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                            <p className="text-xs text-text-muted truncate">{item.content.substring(0, 80)}...</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                                }`}>{item.status}</span>
                                            <p className="text-[10px] text-text-muted mt-1">{item.format}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default AdminDashboard;
