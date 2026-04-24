'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SEO } from './shared/SEO';
import { 
    Sparkles, 
    Zap, 
    Youtube, 
    Target, 
    Inbox, 
    DollarSign, 
    Users, 
    Anchor, 
    ChevronRight, 
    Play,
    Shield,
    ArrowUpRight,
    MousePointer2
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-brand-primary/30">
            <SEO 
                title="ContextMatic - The Elite AI Content Distribution Engine" 
                description="Transform your identity into a multi-platform content empire. Brand Voice, Repurpose Studio, Content OS, and Monetisation." 
            />

            {/* Premium Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/40 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">C</div>
                        <span className="text-xl font-bold tracking-tighter">ContextMatic</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Intelligence</a>
                        <a href="#studio" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Studio</a>
                        <a href="#pricing" className="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Access</a>
                        <button onClick={() => router.push('/sign-in')} className="btn btn-secondary py-2.5 px-6 text-xs font-black uppercase tracking-widest border-white/10 hover:bg-white/5">Member Login</button>
                        <button onClick={() => router.push('/sign-in')} className="btn btn-primary py-2.5 px-8 text-xs font-black uppercase tracking-widest bg-brand-primary text-black border-none shadow-[0_0_20px_rgba(59,130,246,0.2)]">Start Creating</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-brand-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Release 2.0: The Enterprise Suite is Live</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-[0.9] text-white animate-fade-in-up">
                        ONE VOICE. <br />
                        <span className="text-kinetic">EVERY PLATFORM.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:200ms]">
                        The first AI content engine that captures your Brand Voice Fingerprint to scale your presence without losing your soul.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up [animation-delay:400ms]">
                        <button 
                            onClick={() => router.push('/sign-in')}
                            className="btn btn-primary px-12 py-6 text-lg font-black tracking-tight gap-3 shadow-[0_0_40px_rgba(59,130,246,0.3)] group"
                        >
                            Build Your Empire <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="flex items-center gap-4 text-white hover:text-brand-primary transition-colors group px-6">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
                                <Play className="w-4 h-4 fill-current ml-1" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">Watch the Engine</span>
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 animate-fade-in">
                        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                            {['X', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok'].map(platform => (
                                <span key={platform} className="text-2xl font-black italic tracking-tighter">{platform}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Ecosystem Grid */}
            <section id="features" className="py-40 px-8 relative">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                        <div className="space-y-6 max-w-2xl">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none text-white">THE FULL <span className="text-kinetic">ECOSYSTEM</span></h2>
                            <p className="text-lg text-text-secondary leading-relaxed">
                                Beyond simple generation. We built a command center for the modern solopreneur.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 italic text-sm text-text-muted">
                            <Shield className="w-5 h-5 text-brand-primary" />
                            Secure, Private, Proprietary Training.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            icon={Sparkles} 
                            title="Brand Voice" 
                            desc="Proprietary fingerprinting matches your tone, style, and vocabulary." 
                            tag="Identity"
                        />
                        <FeatureCard 
                            icon={Youtube} 
                            title="Repurpose" 
                            desc="Turn one YouTube video or podcast into 30+ viral social posts." 
                            tag="Studio"
                        />
                        <FeatureCard 
                            icon={Zap} 
                            title="Content OS" 
                            desc="Automated weekly planning fueled by viral context data." 
                            tag="Efficiency"
                        />
                        <FeatureCard 
                            icon={Users} 
                            title="Intel" 
                            desc="Reverse-engineer viral formulas from your biggest competitors." 
                            tag="Growth"
                        />
                        <FeatureCard 
                            icon={Inbox} 
                            title="Inbox" 
                            desc="Unified audience engagement across X, LinkedIn, and more." 
                            tag="Social"
                        />
                        <FeatureCard 
                            icon={Target} 
                            title="A/B Lab" 
                            desc="Split-test hook psychology using Logic vs. Emotion angles." 
                            tag="Scale"
                        />
                        <FeatureCard 
                            icon={Anchor} 
                            title="Hook Bank" 
                            desc="500+ proven viral hooks personalized to your niche." 
                            tag="Viral"
                        />
                        <FeatureCard 
                            icon={DollarSign} 
                            title="Monetise" 
                            desc="AI-powered offer architect and direct response ad copy." 
                            tag="Revenue"
                        />
                    </div>
                </div>
            </section>

            {/* Performance Showcase */}
            <section id="studio" className="py-40 px-8 bg-zinc-900/40">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="text-brand-primary font-black text-xs uppercase tracking-[0.3em]">Repurpose Studio</div>
                            <h2 className="text-6xl font-black leading-[0.9] text-white">STOP CREATING.<br />START <span className="text-kinetic">TRANSFORMING.</span></h2>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
                                Spend 60 minutes on a high-value video. Let ContextMatic handle the next 30 days of social distribution.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                "10-Min Video → 30 Platform Posts",
                                "AI Style-Match Transcription",
                                "Automated Content Calendar Sync",
                                "Multi-Language Hinglish Support"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-white tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => router.push('/sign-in')} className="btn btn-primary px-10 py-5 group">
                            Unlock the Studio <ArrowUpRight className="w-5 h-5 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-10 bg-brand-primary/20 blur-[100px] rounded-full -z-10" />
                        <div className="card aspect-video bg-[#121214] border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent group-hover:opacity-20 transition-opacity" />
                           <div className="absolute top-6 left-6 right-6 bottom-6 border border-white/5 rounded-[1.5rem] flex flex-col items-center justify-center gap-4">
                                <MousePointer2 className="w-12 h-12 text-brand-primary animate-bounce" />
                                <div className="text-center">
                                    <p className="font-black text-white text-xl">Interactive Demo</p>
                                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Sign in to experience the power</p>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-60 px-8 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="text-7xl md:text-8xl font-black tracking-tighter text-white">YOUR CONTENT EMPIRE IS <span className="text-kinetic">ONE CLICK AWAY.</span></h2>
                    <p className="text-xl text-text-secondary max-w-xl mx-auto italic">"The ROI on my time is 10x since switching to ContextMatic."</p>
                    <div className="pt-8">
                        <button 
                            onClick={() => router.push('/sign-in')}
                            className="btn btn-primary px-16 py-8 text-2xl font-black hover:scale-105 transition-transform shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                        >
                            GET STARTED FREE
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-2 space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-black text-black">C</div>
                            <span className="text-xl font-bold tracking-tighter">ContextMatic</span>
                        </div>
                        <p className="text-text-muted max-w-xs text-sm leading-relaxed">
                            The elite suite for modern content creators. Powered by proprietary AI and direct-response psychology.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Platform</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">Brand Voice</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">A/B Lab</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">Hooks</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">Pricing</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Connect</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">X / Twitter</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">LinkedIn</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">Support</li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer">API Docs</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <span>© 2024 ContextMatic Enterprise</span>
                    <span>Built for the Digital Elite</span>
                </div>
            </footer>
        </div>
    );
};

function FeatureCard({ icon: Icon, title, desc, tag }: { icon: React.ElementType, title: string, desc: string, tag: string }) {
    return (
        <div className="card p-10 bg-[#121214] border-white/5 hover:border-brand-primary/30 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32" />
            </div>
            
            <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black transition-all">
                    <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-3">
                    <div className="text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em]">{tag}</div>
                    <h3 className="text-2xl font-black text-white">{title}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>

            <div className="pt-6 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-brand-primary transition-colors flex items-center gap-2">
                    Learn More <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;