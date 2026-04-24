"use client";

import React, { useState } from 'react';
import { PageLayout } from '@/components/shared';
import { useRouter } from 'next/navigation';
import { Search, Calendar, ArrowRight, BookOpen, Clock } from 'lucide-react';

const BLOG_POSTS = [
    {
        title: '7 Ways to Repurpose Your Long-Form Video Content',
        excerpt: 'Learn how to turn a single YouTube video into a month of social media dominance using ContextMatic.',
        date: 'Oct 24, 2026',
        author: 'Julian Thorne',
        readTime: '6 min read',
        slug: '7-ways-repurpose-video',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Why AI Content is the Secret to Solo-Founder Success',
        excerpt: 'How one individual used AI to manage a 100k follower network while building a million-dollar SaaS.',
        date: 'Oct 18, 2026',
        author: 'Elena Rossi',
        readTime: '4 min read',
        slug: 'ai-content-solo-founder',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Mastering the Brand Voice: A Guide to Consistent AI Copy',
        excerpt: 'Training your AI to sound just like you is easier than you think. Master our Brand Voice engine.',
        date: 'Oct 12, 2026',
        author: 'Markus Chen',
        readTime: '8 min read',
        slug: 'mastering-brand-voice',
        image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800'
    }
];

export default function BlogListingPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = BLOG_POSTS.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">The <span className="text-brand-primary italic">Creator</span> Journal</h1>
                    <p className="text-xl text-text-secondary leading-relaxed">
                        Industry insights, case studies, and advanced strategies to scale your digital presence with AI.
                    </p>
                    
                    <div className="mt-10 relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input 
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input w-full pl-12 pr-6 py-4 bg-background-surface/50 border-white/5 rounded-2xl focus:border-brand-primary transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPosts.map((post, idx) => (
                        <div 
                            key={post.slug}
                            onClick={() => router.push(`/blog/${post.slug}`)}
                            className="group cursor-pointer flex flex-col bg-background-surface/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img 
                                    src={post.image} 
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                                    alt={post.title} 
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1 text-left">
                                <div className="flex items-center gap-4 text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-text-secondary text-base leading-relaxed mb-8 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-white">
                                            {post.author[0]}
                                        </div>
                                        <span className="text-sm font-medium text-text-muted">{post.author}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-12 bg-gradient-to-br from-brand-primary/10 to-purple-600/5 border border-white/5 rounded-[3rem] text-center">
                    <BookOpen className="w-12 h-12 text-brand-primary mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-white mb-4">Stay ahead of the curve.</h3>
                    <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
                        Get our weekly deep-dive into AI content trends delivered straight to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="input flex-1 p-4 bg-black/40 border-white/10 rounded-xl"
                        />
                        <button className="btn btn-primary px-8 py-4">Subscribe</button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
