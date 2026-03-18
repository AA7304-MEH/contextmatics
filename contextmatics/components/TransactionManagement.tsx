import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

export const TransactionManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/transactions');
            if (!response.ok) throw new Error('Failed to fetch transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="card border border-white/5 bg-background-surface/30 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">Transaction Logs</h3>
                <button 
                  onClick={fetchTransactions}
                  className="btn btn-secondary py-1.5 px-3 text-xs"
                >
                  Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center text-text-secondary">
                        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading transactions...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Gateway</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Amount</th>
                                <th className="px-6 py-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(tx.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{tx.profiles?.full_name || 'User'}</span>
                                                <span className="text-xs text-text-tertiary">@{tx.profiles?.username || tx.user_id.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-zinc-300 font-mono text-xs">{tx.gateway}</span>
                                            <p className="text-[9px] text-zinc-500">{tx.gateway_payment_id}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-400">
                                            {tx.currency} {tx.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                                                ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                  tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                  'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No transactions found.
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
