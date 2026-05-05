"use client";

import React from 'react';
import { PageLayout } from '@/components/shared';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Copy } from 'lucide-react';

const POST_CONTENT:any = {
    '7-ways-repurpose-video': {
        title: '7 Ways to Repurpose Your Long-Form Video Content',
        date: 'Oct 24, 2026',
        author: 'Julian Thorne',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
                In the modern attention economy, a single video is no longer just "a video." It is a foundational asset that can be dissected, reformatted, and distributed across a dozen channels. If you are only posting your long-form content to YouTube, you are leaving 90% of your potential reach on the table.
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">01. The Twitter (X) Thread</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Extract the 5-7 core insights from your video. Each insight becomes a tweet. Use the video thumbnail as the hook for the first tweet and link back to the full video in the middle of the thread.
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">02. The "Faceless" YouTube Short</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Identify a 59-second high-impact segment. Use ContextMatic's Faceless Studio to add dynamic captions and b-roll. Vertical video is the primary driver of new discovery in 2026.
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">03. The LinkedIn Carousel</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                Take your video's core framework and turn it into a 10-slide PDF carousel. LinkedIn's algorithm currently prioritizes document posts over standard text updates.
            </p>
        `
    }
};

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const post = POST_CONTENT[slug as string] || POST_CONTENT['7-ways-repurpose-video'];

    return (
        <PageLayout>
             <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => router.push('/blog')}
                        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Journal
                    </button>

                    <div className="mb-12 text-left animate-fade-in">
                        <div className="flex items-center gap-6 text-xs font-bold text-brand-primary uppercase tracking-widest mb-6">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-8">{post.title}</h1>
                        <div className="flex items-center justify-between py-8 border-y border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg text-white border border-white/5">
                                    {post.author[0]}
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold">{post.author}</p>
                                    <p className="text-xs text-text-muted">Content Strategy Lead @ ContextMatic</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"><Twitter className="w-4 h-4 text-text-muted hover:text-white" /></button>
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"><Linkedin className="w-4 h-4 text-text-muted hover:text-white" /></button>
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"><Copy className="w-4 h-4 text-text-muted hover:text-white" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[3rem] overflow-hidden mb-16 shadow-2xl border border-white/5 group animate-fade-in-up">
                        <img 
                            src={post.image} 
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000" 
                            alt={post.title} 
                        />
                    </div>

                    <div 
                        className="prose prose-invert prose-lg max-w-none text-left mb-20 animate-fade-in-up delay-200"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] text-left flex flex-col md:flex-row items-center gap-10">
                        <div className="shrink-0 w-32 h-32 rounded-[2rem] bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-6xl shadow-xl shadow-brand-primary/20">
                            C
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-white mb-3">Scale your reach today.</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Everything mentioned in this article is possible in minutes with ContextMatic. Start your AI journey for free.
                            </p>
                            <button 
                                onClick={() => router.push('/sign-up')}
                                className="btn btn-primary px-10 py-4 flex items-center gap-3 group"
                            >
                                Get Started Free <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </PageLayout>
    );
}
