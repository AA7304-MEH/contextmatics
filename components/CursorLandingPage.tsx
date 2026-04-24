"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ModernNav } from './shared/ModernNav';
import { ArrowRight, Play, Sparkles, TrendingUp, CheckCircle2, ChevronRight, Layout, Video, PenTool, Share2 } from 'lucide-react';

const Hero = () => {
    const router = useRouter();
    return (
        <header className="relative flex flex-col items-center text-center pt-24 pb-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 rounded-full text-xs font-bold text-brand-primary uppercase tracking-widest shadow-xl">
                    <Sparkles className="w-3 h-3 fill-brand-primary" /> Multi-Channel AI Powerhouse
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] max-w-5xl mx-auto text-white">
                    Transform ideas into<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Viral content in seconds.</span>
                </h1>

                <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium">
                    The ultimate workspace for creators. Turn one prompt into blog posts, LinkedIn threads, high-converting scripts, and AI videos instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                    <button 
                        onClick={() => router.push('/sign-in')} 
                        className="group btn btn-primary text-lg px-10 py-5 bg-brand-primary border-none shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all flex items-center gap-3"
                    >
                        Start Creating Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={() => router.push('/pricing')} 
                        className="btn bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 text-lg font-bold flex items-center gap-2"
                    >
                        <Play className="w-5 h-5 fill-white text-white" /> See how it works
                    </button>
                </div>

                <div className="mt-8 flex items-center gap-8 opacity-50">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background-primary bg-zinc-800" />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-text-muted">Trusted by 5,000+ top-tier creators</p>
                </div>
            </div>

            {/* Product Mockup Container */}
            <div className="relative mt-20 w-full max-w-6xl mx-auto px-4 perspective-1000 animate-fade-in-up delay-300">
                <div className="relative rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden bg-[#09090b] transform rotate-x-5 shadow-brand-primary/10">
                    <img 
                        src="/dashboard-mockup.png" 
                        alt="ContextMatic Dashboard" 
                        className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                    />
                    {/* Glass Overlay on Mockup */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-40 pointer-events-none" />
                </div>
                
                {/* Floating Elements Around Mockup */}
                <div className="hidden lg:block absolute -top-10 -right-20 p-6 bg-background-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-float">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-emerald-400 w-5 h-5" />
                        <span className="text-sm font-bold text-white">+342% Engagement</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

const SocialProof = () => {
    const brands = [
        { name: 'Vortex', color: 'from-blue-400 to-indigo-500' },
        { name: 'Chronos', color: 'from-purple-400 to-pink-500' },
        { name: 'Pulse.AI', color: 'from-emerald-400 to-teal-500' },
        { name: 'Strata', color: 'from-amber-400 to-orange-500' },
        { name: 'Nexus', color: 'from-rose-400 to-red-500' },
    ];

    return (
        <section className="py-20 border-y border-white/5 bg-white/[0.01]">
            <div className="container mx-auto px-6">
                <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-12">Empowering teams at world-class agencies</p>
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 transition-all duration-700">
                    {brands.map((brand) => (
                        <div key={brand.name} className="group relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${brand.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                            <div className="relative px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm group-hover:border-white/20 transition-all duration-500 flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${brand.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                                <span className="text-xl font-black tracking-tighter text-white/40 group-hover:text-white transition-colors uppercase">
                                    {brand.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Features = () => {
    const features = [
        {
            icon: <PenTool className="w-8 h-8 text-blue-400" />,
            title: 'AI Content Studio',
            desc: 'Turn any raw transcript or idea into polished SEO blog posts, Twitter threads, and LinkedIn dominance.',
            highlight: 'Built on Gemini 1.5 Pro'
        },
        {
            icon: <Video className="w-8 h-8 text-purple-400" />,
            title: 'Faceless Video Studio',
            desc: 'Generate viral YouTube shorts and TikToks from text. Automatic voiceovers, captions, and b-roll.',
            highlight: 'High-Retention Styles'
        },
        {
            icon: <Share2 className="w-8 h-8 text-emerald-400" />,
            title: 'Multi-Channel Distribution',
            desc: 'One-click cross-posting. Sync your brand voice across 7+ platforms from a single workspace.',
            highlight: 'Official API Integration'
        },
        {
            icon: <Layout className="w-8 h-8 text-amber-400" />,
            title: 'Agency Workspaces',
            desc: 'Manage multiple clients or teams. Shared brand personas, assets, and collaborative workflows.',
            highlight: 'Team-Ready'
        },
    ];

    return (
        <section id="features" className="py-32 relative">
             <div className="container mx-auto px-6">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase leading-tight">Built for scale.</h2>
                    <p className="text-xl text-text-secondary">Stop manual content creation. ContextMatic is the engine that drives your entire social footprint.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="group relative p-10 rounded-[3rem] border border-white/5 bg-background-surface/30 hover:bg-white/[0.03] transition-all duration-500 overflow-hidden cursor-default">
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                <ChevronRight className="w-6 h-6 text-brand-primary" />
                            </div>
                            
                            <div className="mb-10 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                            <p className="text-text-secondary text-lg leading-relaxed mb-8">{feature.desc}</p>
                            
                            <div className="inline-flex px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-text-muted transition-colors group-hover:text-white">
                                {feature.highlight}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { num: '01', title: 'Connect Your Voice', desc: 'Define your brand persona once. CM learns your tone perfectly.' },
        { num: '02', title: 'Input Any Asset', desc: 'Paste a video link, an article, or just a raw voice note.' },
        { num: '03', title: 'Select Targets', desc: 'Choose what you need: Blog, Thread, Video, or Newsletter.' },
        { num: '04', title: 'Review & Publish', desc: 'Review the AI drafts and hit publish. Done in minutes.' },
    ];

    return (
        <section className="py-32 bg-white/[0.01]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-20 uppercase">How it works.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {steps.map((s) => (
                        <div key={s.num} className="relative text-left flex flex-col items-start gap-6 group">
                            <span className="text-8xl font-black text-white opacity-[0.03] absolute -top-12 -left-4 group-hover:opacity-[0.08] transition-opacity">{s.num}</span>
                            <div className="relative z-10 w-full">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-brand-primary" /> {s.title}
                                </h3>
                                <p className="text-text-secondary text-base leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = () => {
    const router = useRouter();
    return (
        <section className="py-32 pb-48">
            <div className="container mx-auto px-6">
                <div className="relative rounded-[4rem] border border-white/10 bg-gradient-to-br from-brand-primary/20 via-background-surface to-purple-600/10 p-16 md:p-24 text-center overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[0.9]">
                            Stop manual labor.<br/><span className="text-brand-primary">Start scaling.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-12 font-medium">
                            Join 5,000+ creators and agencies turning ideas into professional content at lightning speed.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => router.push('/sign-in')}
                                className="group btn px-12 py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-2xl"
                            >
                                Get Early Access <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => router.push('/pricing')}
                                className="btn bg-white/5 border border-white/10 px-12 py-5 text-xl text-white font-bold rounded-2xl hover:bg-white/10"
                            >
                                View Pricing
                            </button>
                        </div>
                        <p className="mt-8 text-sm text-text-muted font-bold uppercase tracking-widest">
                            No Credit Card Required · Unlimited Potential
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const router = useRouter();
    return (
        <footer className="border-t border-white/5 py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 text-left">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                <span className="text-white font-black text-xl">C</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">ContextMatic</span>
                        </div>
                        <p className="text-lg text-text-secondary max-w-sm leading-relaxed mb-10">
                            The professional AI content engine for modern marketers. Create, repurpose, and distribute with unmatched speed.
                        </p>
                        <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                             {/* Social Icons Placeholder */}
                             <div className="w-6 h-6 bg-white rounded-md" />
                             <div className="w-6 h-6 bg-white rounded-md" />
                             <div className="w-6 h-6 bg-white rounded-md" />
                        </div>
                    </div>
                    
                    <div className="md:col-span-2">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Platform</h4>
                        <ul className="space-y-4 text-text-secondary font-medium">
                            <li><button onClick={() => router.push('/pricing')} className="hover:text-brand-primary transition-colors">Pricing</button></li>
                            <li><button onClick={() => router.push('/content-creator')} className="hover:text-brand-primary transition-colors">Studio</button></li>
                            <li><button onClick={() => router.push('/video-generator')} className="hover:text-brand-primary transition-colors">AI Video</button></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Resources</h4>
                        <ul className="space-y-4 text-text-secondary font-medium">
                            <li><button onClick={() => router.push('/history')} className="hover:text-brand-primary transition-colors">Documentation</button></li>
                            <li><button onClick={() => router.push('/history')} className="hover:text-brand-primary transition-colors">Community</button></li>
                            <li><button onClick={() => router.push('/history')} className="hover:text-brand-primary transition-colors">Templates</button></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Company</h4>
                        <ul className="space-y-4 text-text-secondary font-medium">
                            <li><a href="#" className="hover:text-brand-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-text-muted text-sm font-medium italic">Hand-crafted by the ContextMatic elite team.</p>
                    <div className="flex items-center gap-8">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">© 2026 ContextMatic Inc.</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const CursorLandingPage = () => {
    return (
        <div className="bg-background-primary min-h-screen overflow-x-hidden selection:bg-brand-primary/30">
            <ModernNav />
            <Hero />
            <SocialProof />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </div>
    );
};
