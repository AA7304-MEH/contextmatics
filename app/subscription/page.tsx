"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLayout } from '@/components/shared';
import { useToast } from '@/context/ToastContext';
import { CreditCard, History, Zap, TrendingUp, AlertCircle, Download, CheckCircle2 } from 'lucide-react';

const PLAN_CREDITS: Record<string, number> = {
    free: 5,
    pro: 100,
    business: 500,
    enterprise: 2500
};

const PLAN_NAMES: Record<string, string> = {
    free: 'Free Explorer',
    pro: 'Pro Creator',
    business: 'Business Power',
    enterprise: 'Enterprise Scale',
    free_abuse: 'Free Tier (Limited)'
};

export default function SubscriptionPage() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [billingHistory, setBillingHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const planId = user?.plan || 'free';
    const planLimit = PLAN_CREDITS[planId] || 5;
    const creditsRemaining = user?.credits_remaining || 0;
    const creditsUsed = Math.max(0, planLimit - creditsRemaining);
    const usagePercent = planLimit > 0 ? ((creditsUsed / planLimit) * 100) : 0;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/payments/history');
                if (res.ok) {
                    const data = await res.json();
                    setBillingHistory(data);
                }
            } catch (err) {
                console.error('Failed to fetch billing history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleCancel = () => {
        showToast('To cancel your premium plan, please contact billing@contextmatic.example.com or use the Stripe dashboard.', 'info');
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 md:py-20 text-left">
                {/* Header Section */}
                <div className="max-w-4xl mb-12 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl">
                            <CreditCard className="w-6 h-6 text-blue-500" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Billing & Plans</h1>
                    </div>
                    <p className="text-lg text-zinc-500 max-w-2xl">
                        Manage your subscription, monitor credit usage, and download your past invoices.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-in">
                    {/* Active Plan Card */}
                    <div className="lg:col-span-2 card p-10 border border-white/10 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Zap className="w-12 h-12 text-blue-500/10 group-hover:scale-125 transition-transform duration-700" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                        Active Now
                                    </span>
                                </div>
                                
                                <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                                    {PLAN_NAMES[planId]}
                                </h2>
                                <p className="text-zinc-500 font-bold mb-10">Premium AI Production Access</p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => router.push('/pricing')}
                                        className="px-8 py-4 rounded-2xl bg-white text-black text-sm font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                                    >
                                        Upgrade Plan
                                    </button>
                                    <button 
                                        onClick={handleCancel}
                                        className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-black hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            </div>

                            <div className="w-full md:w-64 flex flex-col justify-end">
                                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Credit Allocation</p>
                                    <div className="text-5xl font-black text-white mb-2">{planLimit}</div>
                                    <p className="text-xs text-zinc-500 font-bold">Credits per month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Meter */}
                    <div className="card p-10 border border-white/10 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] flex flex-col">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" /> Current Usage
                        </h3>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="mb-10 text-center">
                                <div className="text-6xl font-black text-white tracking-tighter mb-2">
                                    {creditsRemaining}
                                </div>
                                <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">Credits Remaining</p>
                            </div>

                            <div className="space-y-4">
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">
                                    <span>{creditsUsed} Used</span>
                                    <span>{planLimit} Total</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-amber-500 font-bold leading-relaxed">
                                Credits reset on your next billing date. High usage detected, consider upgrading.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Billing History Table */}
                <div className="card border border-white/10 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden animate-fade-in shadow-2xl">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl">
                                <History className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Payment History</h2>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">ID / Order</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center animate-pulse">
                                            <p className="text-zinc-600 tracking-widest uppercase font-black">Loading receipts...</p>
                                        </td>
                                    </tr>
                                ) : billingHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-zinc-600">
                                            <p className="tracking-widest uppercase font-black mb-2 opacity-20 text-5xl">📄</p>
                                            <p className="tracking-widest uppercase font-black">No transaction records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    billingHistory.map((bill, index) => (
                                        <tr key={bill.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-8 font-mono text-zinc-500 text-xs">#{bill.gateway_payment_id || bill.id.slice(0, 8)}</td>
                                            <td className="p-8">{new Date(bill.created_at).toLocaleDateString()}</td>
                                            <td className="p-8 text-lg font-black">{bill.currency === 'INR' ? '₹' : '$'}{bill.amount}</td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Successful</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right">
                                                <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white text-zinc-500 hover:text-black transition-all">
                                                    DOWNLOAD
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
