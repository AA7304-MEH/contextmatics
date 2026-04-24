"use client";

import React, { useState } from 'react';
import { PageLayout } from '@/components/shared';
import { useRouter } from 'next/navigation';
import { Search, Zap, CreditCard, Play, ArrowRight, HelpCircle, LifeBuoy, Sparkles } from 'lucide-react';

const HELP_CATEGORIES = [
    {
        title: 'Getting Started',
        icon: <Zap className="w-6 h-6 text-brand-primary" />,
        articles: [
            { title: 'Choosing your first template', slug: 'choosing-templates' },
            { title: 'Setting up Brand Voice', slug: 'setup-brand-voice' },
            { title: 'Connecting your first social account', slug: 'connecting-social' }
        ]
    },
    {
        title: 'Billing & Subscriptions',
        icon: <CreditCard className="w-6 h-6 text-blue-400" />,
        articles: [
            { title: 'Understanding the credit system', slug: 'credits-explained' },
            { title: 'How to cancel your plan', slug: 'cancel-plan' },
            { title: 'Updating payment methods', slug: 'update-billing' }
        ]
    },
    {
        title: 'Advanced Features',
        icon: <Play className="w-6 h-6 text-purple-400" />,
        articles: [
            { title: 'Using the Video Editor timeline', slug: 'video-editor-guide' },
            { title: 'Managing Agency Workspaces', slug: 'workspaces-tutorial' },
            { title: 'Bulk content generation', slug: 'bulk-content' }
        ]
    }
];

export default function HelpCenterPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = HELP_CATEGORIES.map(cat => ({
        ...cat,
        articles: cat.articles.filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.articles.length > 0);

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-20 text-left">
                <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tight">Help Center</h1>
                    </div>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">Everything you need to master ContextMatic and scale your output.</p>
                    
                    <div className="mt-12 relative max-w-xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600" />
                        <input 
                            type="text"
                            placeholder="Search for articles, guides, or features..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-lg font-bold text-white focus:border-blue-500 focus:bg-white/[0.05] transition-all outline-none shadow-2xl"
                        />
                    </div>
                </div>

                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
                        {filteredCategories.map((cat, idx) => (
                            <div 
                                key={cat.title} 
                                className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 flex flex-col group hover:border-white/20 transition-all animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="p-5 bg-white/5 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
                                    {cat.title}
                                </h3>
                                <ul className="space-y-4 flex-1 mb-10">
                                    {cat.articles.map((article) => (
                                        <li key={article.slug}>
                                            <button 
                                                onClick={() => router.push(`/help/${article.slug}`)}
                                                className="text-zinc-500 hover:text-white transition-all flex items-center gap-3 group/item text-sm font-black uppercase tracking-widest"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-20 group-hover/item:opacity-100 group-hover/item:scale-150 transition-all" />
                                                {article.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button className="text-xs font-black text-blue-500 flex items-center gap-2 group/btn uppercase tracking-widest">
                                    VIEW ALL <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔎</div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No results found</h3>
                        <p className="text-zinc-500 font-bold max-w-sm mx-auto">We couldn't find any articles matching "{searchQuery}". Try different keywords or reach out to support.</p>
                    </div>
                )}

                <div className="max-w-5xl mx-auto p-12 bg-blue-600/[0.03] border border-blue-500/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between text-left gap-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-24 h-24 text-blue-500" />
                    </div>
                    
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/20">
                            <LifeBuoy className="w-10 h-10 animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase tracking-widest">Need human help?</h3>
                            <p className="text-zinc-500 text-lg font-bold">Our team of experts is available 24/7 via live chat.</p>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 relative z-10 active:scale-95">
                         Chat with Support
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}
