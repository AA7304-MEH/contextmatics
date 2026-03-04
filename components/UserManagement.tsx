import React, { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { useToast } from '@/context/ToastContext';

export const UserManagement: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<string>('all');
    const { showToast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setProfiles(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = profiles.filter(user => {
        const email = user.id; // Profile might not have email, but in our schema, we should check what we have
        // Actually, our profiles table has id, username, full_name, plan, credits_remaining
        const matchesSearch = (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
        return matchesSearch && matchesPlan;
    });

    return (
        <div className="card border border-white/5 bg-background-surface/30 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">User Database</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input py-2 px-4 text-sm w-64"
                    />
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="input py-2 px-4 text-sm w-40"
                    >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="business">Business</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center text-text-secondary">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading profiles...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Name / Username</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Plan</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Credits</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{profile.full_name || 'Anonymous'}</span>
                                                <span className="text-xs text-text-tertiary">@{profile.username || profile.id.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                                                ${profile.plan === 'free' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                                                    profile.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        profile.plan === 'business' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {profile.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-300">
                                            {profile.credits_remaining >= 999999 ? '∞' : profile.credits_remaining}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button className="text-zinc-400 hover:text-white font-medium text-xs transition-colors">Log</button>
                                                <button className="text-blue-400/70 hover:text-blue-400 font-medium text-xs transition-colors">Grant</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No profiles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
