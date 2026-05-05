"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';

interface Template {
    id: string;
    title: string;
    description: string;
    category: 'social' | 'blog' | 'email' | 'video' | 'ad';
    prompt: string;
    icon: string;
    popularity: number; // 1-5
    isPro: boolean;
}

const TEMPLATES: Template[] = [
    // Social Media
    {
        id: 'social-1',
        title: 'Viral Twitter Thread',
        description: 'Turn any topic into a compelling 10-tweet thread with hooks and CTAs.',
        category: 'social',
        prompt: 'Write a viral Twitter thread about [TOPIC]. Include a strong hook in tweet 1, valuable insights in tweets 2-8, a summary in tweet 9, and a call-to-action in tweet 10. Use emojis sparingly.',
        icon: '🐦',
        popularity: 5,
        isPro: false,
    },
    {
        id: 'social-2',
        title: 'LinkedIn Thought Leadership',
        description: 'Professional post that positions you as an industry expert.',
        category: 'social',
        prompt: 'Write a LinkedIn post about [TOPIC] that positions the author as a thought leader. Start with a bold statement, share 3 actionable insights, include a personal anecdote, and end with a question to drive engagement.',
        icon: '💼',
        popularity: 4,
        isPro: false,
    },
    {
        id: 'social-3',
        title: 'Instagram Caption Generator',
        description: 'Engaging captions with hashtag strategy for maximum reach.',
        category: 'social',
        prompt: 'Write an engaging Instagram caption about [TOPIC]. Include a hook, storytelling element, call-to-action, and suggest 20 relevant hashtags grouped by reach (high, medium, niche).',
        icon: '📸',
        popularity: 4,
        isPro: false,
    },
    // Blog
    {
        id: 'blog-1',
        title: 'SEO Blog Post',
        description: 'Full blog post optimized for search engines with proper headings.',
        category: 'blog',
        prompt: 'Write a 1500-word SEO-optimized blog post about [TOPIC]. Include: title with keyword, meta description, H2/H3 headings, introduction with hook, 5+ sections with actionable advice, internal linking suggestions, and a conclusion with CTA.',
        icon: '📝',
        popularity: 5,
        isPro: true,
    },
    {
        id: 'blog-2',
        title: 'Listicle Article',
        description: 'Engaging numbered list format that drives high engagement.',
        category: 'blog',
        prompt: 'Write a listicle article: "10 [TOPIC] You Need to Know". Each item should have a catchy sub-headline, 2-3 sentences of explanation, and a practical tip. Include an intro and conclusion.',
        icon: '📋',
        popularity: 4,
        isPro: false,
    },
    {
        id: 'blog-3',
        title: 'How-To Guide',
        description: 'Step-by-step tutorial with clear instructions.',
        category: 'blog',
        prompt: 'Write a comprehensive how-to guide about [TOPIC]. Include: brief intro explaining why this matters, prerequisites, numbered step-by-step instructions (8-12 steps), pro tips for each step, common mistakes to avoid, and FAQ section.',
        icon: '🔧',
        popularity: 3,
        isPro: false,
    },
    // Email
    {
        id: 'email-1',
        title: 'Welcome Email Sequence',
        description: '3-email onboarding sequence for new subscribers.',
        category: 'email',
        prompt: 'Write a 3-email welcome sequence for [BUSINESS/PRODUCT]. Email 1: Warm welcome + what to expect. Email 2: Your top resource/content + social proof. Email 3: Special offer or next step CTA. Each email should be concise with clear subject lines.',
        icon: '📧',
        popularity: 5,
        isPro: true,
    },
    {
        id: 'email-2',
        title: 'Newsletter Issue',
        description: 'Weekly newsletter with curated content and personal touch.',
        category: 'email',
        prompt: 'Write a weekly newsletter about [TOPIC]. Include: personal intro (2-3 sentences), 3 curated links with commentary, one original insight, a "tool of the week" recommendation, and a fun P.S. line.',
        icon: '📰',
        popularity: 4,
        isPro: false,
    },
    // Video
    {
        id: 'video-1',
        title: 'YouTube Script',
        description: 'Full video script with hooks, timestamps, and B-roll notes.',
        category: 'video',
        prompt: 'Write a 10-minute YouTube video script about [TOPIC]. Include: attention-grabbing hook (first 30 seconds), intro with channel branding, 4-5 main points with transitions, B-roll suggestions in brackets, mid-roll CTA, and strong outro with subscribe reminder.',
        icon: '🎥',
        popularity: 5,
        isPro: true,
    },
    {
        id: 'video-2',
        title: 'TikTok/Reels Script',
        description: 'Short-form video script optimized for virality.',
        category: 'video',
        prompt: 'Write a 60-second TikTok/Reels script about [TOPIC]. Include: scroll-stopping hook (first 3 seconds), fast-paced delivery, visual cues in brackets, trending audio suggestion, and on-screen text overlay notes. Keep it punchy and relatable.',
        icon: '📱',
        popularity: 5,
        isPro: false,
    },
    // Ad Copy
    {
        id: 'ad-1',
        title: 'Facebook/Meta Ad Copy',
        description: 'High-converting ad copy with multiple variations.',
        category: 'ad',
        prompt: 'Write 3 Facebook ad copy variations for [PRODUCT/SERVICE]. Each should include: headline (5-7 words), primary text (125 chars), description, and CTA button text. Variations: 1) Pain-point focused, 2) Benefit-focused, 3) Social proof focused.',
        icon: '📢',
        popularity: 4,
        isPro: true,
    },
    {
        id: 'ad-2',
        title: 'Google Ads Copy',
        description: 'Search ad headlines and descriptions within character limits.',
        category: 'ad',
        prompt: 'Write Google Search ad copy for [PRODUCT/SERVICE]. Include: 5 headlines (max 30 characters each), 4 descriptions (max 90 characters each), and 3 sitelink suggestions. Focus on keywords, benefits, and urgency.',
        icon: '🔍',
        popularity: 3,
        isPro: false,
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'ad', label: 'Ad Copy', icon: '📢' },
];

export default function TemplatesPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTemplates = TEMPLATES.filter(t => {
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const useTemplate = (template: Template) => {
        sessionStorage.setItem('template_prompt', template.prompt);
        sessionStorage.setItem('template_name', template.title);
        router.push('/content-creator');
    };

    const renderStars = (count: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < count ? 'text-amber-400' : 'text-white/10'}`}>★</span>
        ));
    };

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div className="container mx-auto px-6 py-12 text-left">
                <div className="mb-10 animate-fade-in">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Templates Library</h1>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        Pre-built prompts to supercharge your content creation. Click "Use" to pre-fill the Content Creator.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-10 animate-fade-in">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-[var(--color-text-muted)]"
                        />
                        <svg className="w-4 h-4 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${selectedCategory === cat.id
                                    ? 'border-blue-500/40 bg-blue-500/10 text-white'
                                    : 'border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className="mr-1.5">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                    {filteredTemplates.map((template, i) => (
                        <div
                            key={template.id}
                            className="group card relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col transition-all duration-300 hover:border-white/15"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            {template.isPro && (
                                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white shadow-lg">
                                    PRO
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl shrink-0">
                                    {template.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-white mb-1 truncate pr-12">{template.title}</h3>
                                    <div className="flex gap-0.5">{renderStars(template.popularity)}</div>
                                </div>
                            </div>

                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 flex-1 line-clamp-2">
                                {template.description}
                            </p>

                            <div className="bg-black/30 rounded-lg p-3 mb-5 border border-white/5">
                                <p className="text-xs text-[var(--color-text-muted)] font-mono line-clamp-2 leading-relaxed">
                                    {template.prompt}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button
                                    onClick={() => useTemplate(template)}
                                    className="btn flex-1 justify-center py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl border-none"
                                >
                                    Use Template ✨
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(template.prompt);
                                        showToast('Prompt copied to clipboard!', 'success');
                                    }}
                                    className="btn py-2.5 px-3 text-sm border border-white/10 bg-white/5 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 rounded-xl"
                                    title="Copy prompt"
                                >
                                    📋
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🔍</span>
                        <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                        <p className="text-[var(--color-text-secondary)]">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
