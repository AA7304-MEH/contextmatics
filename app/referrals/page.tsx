"use client";

import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createBrowserClient } from '@supabase/ssr';
import { Gift, Users, CreditCard, Share2, Copy, Check, Twitter, Facebook, Mail } from 'lucide-react';

export default function ReferralPage() {
    const { user, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const referralCode = user?.referral_code || 'GNR8-BETA';
    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/sign-up?ref=${referralCode}`;

    useEffect(() => {
        if (user) {
            fetchReferrals();
        }
    }, [user]);

    const fetchReferrals = async () => {
        try {
            const { data, error } = await supabase
                .from('referrals')
                .select('*, referred_profile:referred_id(full_name, email)')
                .eq('referrer_id', user!.id);

            if (error) throw error;
            setReferrals(data || []);
        } catch (error: any) {
            console.error(error);
            showToast('Failed to load referral data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        showToast('Referral link copied! 🚀', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnTwitter = () => {
        const text = `I'm using ContextMatic to automate my content! Get 50 free credits with my link: ${referralLink}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12 text-center text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Refer & Earn Credits</h1>
                        <p className="text-lg text-text-secondary">Invite your friends and colleagues to ContextMatic and get 50 bonus credits for every successful signup.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Share Card */}
                        <div className="lg:col-span-2 card p-8 bg-background-surface/50 border border-white/5 relative overflow-hidden group">
                           <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full group-hover:bg-brand-primary/20 transition-colors"></div>
                           <div className="relative z-10 flex flex-col items-center sm:items-start">
                                <Gift className="w-12 h-12 text-brand-primary mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-4">Start Sharing</h3>
                                <p className="text-text-secondary mb-8 text-center sm:text-left">Share your unique link below. When someone signs up and completes their first generation, you both get 50 credits.</p>
                                
                                <div className="w-full flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-4 font-mono text-sm text-text-primary flex items-center justify-between group/link cursor-pointer hover:border-brand-primary/30 transition-colors" onClick={copyToClipboard}>
                                        <span className="truncate">{referralLink}</span>
                                        {copied ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-text-muted shrink-0 group-hover/link:text-white" />}
                                    </div>
                                    <button onClick={copyToClipboard} className="btn btn-primary px-8 py-4 flex items-center justify-center gap-2">
                                        <Share2 className="w-4 h-4" /> Copy Link
                                    </button>
                                </div>

                                <div className="mt-8 flex gap-4">
                                     <button onClick={shareOnTwitter} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/20 border border-white/10 hover:border-[#1DA1F2]/30 flex items-center justify-center group/tw transition-all">
                                        <Twitter className="w-5 h-5 text-text-muted group-hover/tw:text-[#1DA1F2]" />
                                     </button>
                                     <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#4267B2]/20 border border-white/10 hover:border-[#4267B2]/30 flex items-center justify-center group/fb transition-all">
                                        <Facebook className="w-5 h-5 text-text-muted group-hover/fb:text-[#4267B2]" />
                                     </button>
                                     <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 flex items-center justify-center group/em transition-all">
                                        <Mail className="w-5 h-5 text-text-muted group-hover/em:text-emerald-400" />
                                     </button>
                                </div>
                           </div>
                        </div>

                        {/* Stats Card */}
                        <div className="card p-8 bg-background-surface/50 border border-white/5 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="flex justify-between items-center text-left">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1">Total Referrals</p>
                                        <h4 className="text-3xl font-bold text-white">{referrals.filter(r => r.status === 'completed').length}</h4>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-400 opacity-50" />
                                </div>
                                <div className="flex justify-between items-center text-left">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1">Earned Credits</p>
                                        <h4 className="text-3xl font-bold text-emerald-400">{user?.referral_credits_earned || 0}</h4>
                                    </div>
                                    <CreditCard className="w-8 h-8 text-emerald-400 opacity-50" />
                                </div>
                                <div className="pt-4 border-t border-white/5 text-left">
                                    <p className="text-xs text-text-secondary leading-relaxed">Referrals are processed instantly. You can refer an unlimited number of users.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Referral History</h2>
                        <div className="card bg-background-surface/30 border border-white/5 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">Referred User</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">Date</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">Status</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-text-muted">Reward</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {referrals.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-text-secondary text-sm italic">
                                                No referrals yet. Start sharing your link!
                                            </td>
                                        </tr>
                                    ) : (
                                        referrals.map((r) => (
                                            <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{r.referred_profile?.full_name || 'Anonymous Creator'}</div>
                                                    <div className="text-xs text-text-muted">{r.referred_profile?.email ? `***${r.referred_profile.email.split('@')[0].slice(-2)}@${r.referred_profile.email.split('@')[1]}` : 'n/a'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">
                                                    {new Date(r.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-emerald-400">
                                                    +{r.credits_awarded} Credits
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
