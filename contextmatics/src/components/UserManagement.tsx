import React, { useState } from 'react';

interface MockUser {
    id: string;
    email: string;
    plan: string;
    credits: number;
    joinedDate: string;
    status: 'active' | 'inactive';
}

const MOCK_USERS: MockUser[] = [
    { id: '1', email: 'john.doe@example.com', plan: 'free', credits: 2, joinedDate: '2024-01-15', status: 'active' },
    { id: '2', email: 'jane.smith@example.com', plan: 'pro', credits: 45, joinedDate: '2024-01-20', status: 'active' },
    { id: '3', email: 'mike.jones@example.com', plan: 'business', credits: 120, joinedDate: '2024-02-01', status: 'active' },
    { id: '4', email: 'sarah.connor@example.com', plan: 'free', credits: 0, joinedDate: '2023-12-10', status: 'inactive' },
    { id: '5', email: 'admin@contextmatic.example.com', plan: 'enterprise', credits: 999999, joinedDate: '2023-11-01', status: 'active' },
];

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<string>('all');

    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
        return matchesSearch && matchesPlan;
    });

    return (
        <div className="data-table-container">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">User Database</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search users..."
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
                <table className="data-table w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Plan</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Credits</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Joined</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                                            ${user.plan === 'free' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                                                user.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    user.plan === 'business' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-zinc-300">{user.credits}</td>
                                    <td className="px-6 py-4 text-zinc-400">{user.joinedDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
                                            <span className={`text-xs font-medium ${user.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button className="text-zinc-400 hover:text-white font-medium text-xs transition-colors">Edit</button>
                                            <button className="text-red-400/70 hover:text-red-400 font-medium text-xs transition-colors">Ban</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 text-xs text-zinc-500 text-center">
                <span className="font-bold text-zinc-400">Note:</span> This is a demonstration view. In a production environment, this would fetch real user data from your backend API.
            </div>
        </div>
    );
};
