"use client";

import { useRouter } from 'next/navigation';
import { ModernNav } from './shared/ModernNav';

// --- ContextMatic Landing Page ---

const Hero = () => {
    const router = useRouter();
    return (
        <header className="relative flex flex-col items-center text-center gap-8 mb-32 pt-20">
            {/* Background Mesh */}
            <div className="hero-mesh" />

            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-medium text-[var(--color-text-secondary)]">
                <span className="text-emerald-500">●</span> Now with AI Video Generation
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-tight max-w-4xl mx-auto">
                Create content<br />
                <span className="text-kinetic bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">10x faster with AI.</span>
            </h1>

            <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
                Transform any idea into blog posts, social threads, videos, and newsletters.
                Powered by Gemini AI with built-in templates and analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <button onClick={() => router.push('/sign-in')} className="btn btn-primary text-lg px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 border-none shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                    Start Creating Free →
                </button>
                <button onClick={() => router.push('/pricing')} className="btn btn-secondary text-lg px-8 py-3.5">
                    View Plans
                </button>
            </div>

            {/* Trust Signal */}
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
                No credit card required · Free plan available · 3 credits to start
            </p>
        </header>
    );
};

const Stats = () => {
    const stats = [
        { value: '10K+', label: 'Content Pieces Generated' },
        { value: '2.5K+', label: 'Videos Created' },
        { value: '500+', label: 'Active Creators' },
        { value: '4.9★', label: 'Average Rating' },
    ];

    return (
        <section className="py-16 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <p className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">{stat.value}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const Features = () => {
    const features = [
        {
            icon: '✨',
            color: 'blue',
            title: 'AI Content Creator',
            desc: 'Turn any topic into polished blog posts, Twitter threads, LinkedIn posts, and email newsletters in seconds.'
        },
        {
            icon: '🎬',
            color: 'purple',
            title: 'Video Generator',
            desc: 'Generate videos from text prompts with AI. Supports Smart Mock (free) and Replicate AI (pro) engines.'
        },
        {
            icon: '📚',
            color: 'emerald',
            title: 'Templates Library',
            desc: '12+ pre-built prompt templates across 5 categories. One-click to start creating professional content.'
        },
        {
            icon: '📊',
            color: 'orange',
            title: 'Analytics Dashboard',
            desc: 'Track your usage with interactive charts. Monitor credits, content output, and format distribution.'
        },
    ];

    return (
        <section id="features" className="pb-32 relative">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Everything you need.</h2>
                <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">A complete toolkit for content creators, marketers, and teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {features.map((feature) => (
                    <div key={feature.title} className="card group p-6 border border-white/5 bg-[var(--color-background-surface)]/50 hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-3 text-white">{feature.title}</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { step: '01', title: 'Paste or Type', desc: 'Enter your content, idea, or topic in the editor.' },
        { step: '02', title: 'Choose Format', desc: 'Select from 12+ templates: blog, thread, video script, and more.' },
        { step: '03', title: 'Generate', desc: 'AI creates polished content in seconds. Edit, compare, or regenerate.' },
        { step: '04', title: 'Export & Share', desc: 'Copy to clipboard, download, or repurpose into video formats.' },
    ];

    return (
        <section className="pb-32">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">How it works.</h2>
                <p className="text-[var(--color-text-secondary)] text-lg">Four steps to content creation at scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {steps.map((s, i) => (
                    <div key={s.step} className="relative">
                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-white/10 to-transparent" />
                        )}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-2xl font-bold text-blue-400 mb-5">
                                {s.step}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const CTA = () => {
    const router = useRouter();
    return (
        <section className="pb-32">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/5 to-transparent p-12 md:p-16 text-center overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 blur-3xl" />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Ready to create?
                    </h2>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
                        Join hundreds of creators using ContextMatic to produce content 10x faster.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => router.push('/sign-in')}
                            className="btn text-lg px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => router.push('/pricing')}
                            className="btn btn-secondary text-lg px-10 py-4"
                        >
                            Compare Plans
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LandingFooter = () => {
    const router = useRouter();
    return (
        <footer className="border-t border-white/5 py-16 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-[var(--color-text-secondary)]">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-sm">C</span>
                        </div>
                        <span className="text-white font-bold text-lg">ContextMatic</span>
                    </div>
                    <p className="max-w-xs leading-relaxed">The AI content workspace for creators, marketers, and teams. Turn ideas into content at scale.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-3">
                        <li><button onClick={() => router.push('/pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                        <li><button onClick={() => router.push('/templates')} className="hover:text-white transition-colors">Templates</button></li>
                        <li><button onClick={() => router.push('/sign-in')} className="hover:text-white transition-colors">Sign Up</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Tools</h4>
                    <ul className="space-y-3">
                        <li><button onClick={() => router.push('/content-creator')} className="hover:text-white transition-colors">Content Creator</button></li>
                        <li><button onClick={() => router.push('/video-generator')} className="hover:text-white transition-colors">Video Generator</button></li>
                        <li><button onClick={() => router.push('/analytics')} className="hover:text-white transition-colors">Analytics</button></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-text-muted)]">
                <p>© 2026 ContextMatic. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export const CursorLandingPage = () => {
    return (
        <div className="bg-[var(--color-background-primary)] min-h-screen overflow-x-hidden pt-16">
            <ModernNav />
            <div className="container mx-auto px-6 pt-20">
                <Hero />
                <Stats />
                <Features />
                <HowItWorks />
                <CTA />
                <LandingFooter />
            </div>
        </div>
    );
};
