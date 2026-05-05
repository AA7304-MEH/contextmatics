import React, { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { useToast } from '@/context/ToastContext';
import { GrantCreditsModal } from './admin/GrantCreditsModal';
import { AdminActivityModal } from './admin/AdminActivityModal';

export const UserManagement: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const { showToast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setProfiles(data);
        } catch (error:any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = profiles.filter(user => {
        const matchesSearch = (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
        return matchesSearch && matchesPlan;
    });

    return (
        <div className="card border border-white/5 bg-background-surface/30 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">User Base</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input py-2 px-4 text-xs w-64 bg-black/40 border-white/10 rounded-xl"
                    />
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="input py-2 px-4 text-xs w-40 bg-black/40 border-white/10 rounded-xl"
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
                        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[10px] uppercase font-black tracking-widest">Compiling Database...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Name / Handle</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tier</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Fuel</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Cohort Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white group-hover:text-brand-primary transition-colors">{profile.full_name || 'Anonymous'}</span>
                                                <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-tighter">@{profile.username || profile.id.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border
                                                ${profile.plan === 'free' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                                                    profile.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        profile.plan === 'business' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {profile.plan}
                                             </span>
                                         </td>
                                         <td className="px-6 py-4 font-black text-zinc-300">
                                            {profile.credits_remaining >= 999999 ? 'UNLIMITED' : profile.credits_remaining}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-[10px] font-medium italic">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedUser(profile);
                                                        setIsActivityModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-text-muted hover:text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all"
                                                >
                                                    Audit
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedUser(profile);
                                                        setIsGrantModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all"
                                                >
                                                    Grant
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic text-sm">
                                        No intelligence found for this query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            
            {selectedUser && (
                <>
                    <GrantCreditsModal 
                        user={selectedUser}
                        isOpen={isGrantModalOpen}
                        onClose={() => setIsGrantModalOpen(false)}
                        onSuccess={(newBalance) => {
                            showToast(`Credits fueled for ${selectedUser.username || 'user'}`, 'success');
                            setProfiles(prev => prev.map(p => p.id === selectedUser.id ? { ...p, credits_remaining: newBalance } : p));
                        }}
                    />
                    <AdminActivityModal
                        user={{
                            id: selectedUser.id,
                            username: selectedUser.username || null,
                            full_name: selectedUser.full_name || null
                        }}
                        isOpen={isActivityModalOpen}
                        onClose={() => setIsActivityModalOpen(false)}
                    />
                </>
            )}
        </div>
    );
};
