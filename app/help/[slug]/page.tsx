"use client";

import React from 'react';
import { PageLayout } from '@/components/shared';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, MessageSquare, Shield, Zap, CreditCard, LifeBuoy, Bookmark, Share2 } from 'lucide-react';

const HELP_DATA: any = {
    'credits-explained': {
        title: 'Understanding the Credit System',
        category: 'Billing',
        icon: <CreditCard className="w-5 h-5 text-blue-400" />,
        updatedAt: '2 days ago',
        content: `
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
                Credits are the lifeblood of ContextMatic. They allow you to harness high-performance AI models for text, image, and video generation without worrying about complex token counts or per-minute limits.
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">How are credits consumed?</h2>
            <ul className="space-y-4 text-lg text-text-secondary mb-10">
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">1</span> AI Text Generation (LinkedIn post, tweet, blog draft) = 1 Credit</li>
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">2</span> AI Image or Logo Generation = 2 Credits</li>
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">5</span> 4K Video Export or Faceless Studio Automation = 5 Credits</li>
            </ul>
            <h2 className="text-3xl font-bold text-white mb-6">When do credits renew?</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Paid plans (Pro & Agency) renew their credit balance every 30 days from the moment of subscription. Free/Starter credits are given as a one-time trial and do not replenish automatically.
            </p>
        `
    }
};

export default function HelpArticlePage() {
    const { slug } = useParams();
    const router = useRouter();
    const article = HELP_DATA[slug as string] || HELP_DATA['credits-explained'];

    return (
        <PageLayout>
             <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                    {/* Left: Article */}
                    <div className="flex-1">
                        <button 
                            onClick={() => router.push('/help')}
                            className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                        >
                            <ArrowLeft className="w-4 h-4" /> Help Center
                        </button>

                        <div className="text-left animate-fade-in">
                            <div className="flex items-center gap-3 text-xs font-bold text-brand-primary uppercase tracking-[0.2em] mb-6">
                                {article.icon}
                                {article.category} • Updated {article.updatedAt}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-10">
                                {article.title}
                            </h1>
                            
                            <div 
                                className="prose prose-invert prose-lg max-w-none text-left mb-20 pb-16 border-b border-white/5"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5">
                                <div className="text-left">
                                    <p className="text-white font-bold mb-1">Was this helpful?</p>
                                    <p className="text-xs text-text-muted">74% of people found this helpful</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all font-bold text-sm">Yes 👍</button>
                                    <button className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-bold text-sm">No 👎</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="w-full md:w-80 shrink-0 text-left">
                        <div className="sticky top-32 space-y-8">
                            <div className="p-8 bg-background-surface/30 border border-white/5 rounded-[2.5rem]">
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-brand-primary" /> Related articles
                                </h4>
                                <ul className="space-y-4">
                                    <li><button className="text-sm text-text-secondary hover:text-white transition-colors block text-left">How to upgrade with Razorpay</button></li>
                                    <li><button className="text-sm text-text-secondary hover:text-white transition-colors block text-left">Refund and cancellation policy</button></li>
                                    <li><button className="text-sm text-text-secondary hover:text-white transition-colors block text-left">Referral program credits</button></li>
                                </ul>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-brand-primary/10 to-indigo-600/10 border border-brand-primary/20 rounded-[2.5rem] relative overflow-hidden">
                                <LifeBuoy className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-[0.03] animate-spin-slow" />
                                <h4 className="text-white font-bold mb-4">Still stuck?</h4>
                                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                                    Join our community on Discord for real-time help and tips.
                                </p>
                                <button className="btn btn-primary w-full py-3 justify-center text-sm">Join Discord</button>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </PageLayout>
    );
}
