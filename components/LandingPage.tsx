

// FIX: `useState` must be imported using curly braces for named imports, not as a string literal.
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFingerprint } from '../hooks/useFingerprint';
import Spinner from './ui/Spinner';
import { ClockIcon } from './icons/ClockIcon';
import { TargetIcon } from './icons/TargetIcon';
import { WandIcon } from './icons/WandIcon';
import { QuoteIcon } from './icons/QuoteIcon';
import { COUNTRIES } from '../constants';
import { TwitterIcon } from './icons/TwitterIcon';
import { BlogIcon } from './icons/BlogIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { EmailIcon } from './icons/EmailIcon';


const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('US');
    const [activeTab, setActiveTab] = useState<'tweet' | 'blog' | 'linkedin' | 'email'>('tweet');
    
    const { login, loading: authLoading } = useAuth();
    const { visitorId, loading: fingerprintLoading, error: fingerprintError } = useFingerprint();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (visitorId) {
            await login(email, countryCode, visitorId);
        } else {
            alert("Could not verify your browser. Please try again.");
        }
    };
    
    const testimonials = [
        {
            quote: "ContextMatic has saved me over 10 hours a week. I can now focus on creating content instead of endlessly reformatting it. A total game-changer for my marketing agency.",
            name: "Sarah L.",
            title: "Content Marketing Manager, GrowthLeap Inc.",
        },
        {
            quote: "As a startup founder, I wear many hats. This tool lets me turn one webinar into a dozen pieces of content for all our social channels. The ROI is insane.",
            name: "David Chen",
            title: "Founder, TechNova Solutions",
        },
         {
            quote: "I was skeptical about AI writers, but the quality is outstanding. The generated content feels authentic and requires minimal editing. My engagement has skyrocketed!",
            name: "Maria Rodriguez",
            title: "Creator & Blogger",
        },
    ];

    const sourceContent = `Title: The Art of Deep Work in a Distracted World (Podcast Transcript Snippet)\n\nHost: Welcome back to 'Productivity Unlocked.' Today, we're diving into 'deep work,' a concept popularized by Cal Newport. It’s the ability to focus without distraction on a cognitively demanding task. In a world of constant notifications and open-plan offices, this skill is becoming both rarer and more valuable.\n\nGuest (Dr. Anya Sharma): Absolutely. Deep work is like a superpower for the modern knowledge worker. The key isn't just about ignoring emails for an hour. It's about creating rituals and systems. For example, scheduling 'deep work blocks' in your calendar, just like a meeting. During this time, you're unreachable. No phone, no email, no Slack. It's uncomfortable at first, but the output is phenomenal. You can achieve in 90 minutes what normally takes a full afternoon of fragmented, shallow work. It's about intensity over volume.`;

    const generatedContent = {
        tweet: `1/5 Is "deep work" the most underrated superpower for success in 2024? 🧠⚡️\n\nA recent podcast episode broke down how to master this skill in a world that's designed to distract you. Here's the rundown 🧵\n\n2/5 Deep work isn't just "focusing." It's the ability to work on a hard problem without ANY distractions. Think no phone, no email, no Slack. Sounds impossible, right?\n\n3/5 The key is creating RITUALS. Dr. Anya Sharma suggests scheduling "deep work blocks" in your calendar like a meeting. Make yourself completely unreachable during this time.\n\n4/5 It's about INTENSITY over VOLUME. 90 minutes of pure, uninterrupted deep work can produce more than an entire afternoon of fragmented, "shallow" work.\n\n5/5 How do you practice deep work? Share your tips below! 👇 #DeepWork #Productivity #FutureOfWork`,
        blog: `## Mastering the Superpower of Deep Work in a Distracted World\n\nIn the modern workplace, our attention is the most valuable—and most fragmented—resource we have. Between the constant barrage of emails, Slack notifications, and the allure of social media, the ability to concentrate deeply is becoming a lost art. Yet, as Cal Newport argues in his seminal book, this skill of 'deep work' is more critical than ever.\n\n### What is Deep Work, Really?\n\nDeep work is the practice of focusing without distraction on a cognitively demanding task. It’s not just about putting your phone on silent for a few minutes; it's about creating a sacred space for intense, high-value cognitive output.\n\nAs productivity expert Dr. Anya Sharma recently stated on the 'Productivity Unlocked' podcast, "Deep work is like a superpower for the modern knowledge worker." It allows you to quickly master complex information and produce better results in less time.\n\n### How to Cultivate Your Deep Work Practice\n\n1.  **Schedule It Like a Meeting:** Don't wait for focus to strike. Proactively block out "deep work sessions" on your calendar. Treat these blocks with the same seriousness as an important client meeting—they are non-negotiable.\n\n2.  **Create Rituals:** Develop a pre-work ritual to ease into the state of concentration. This could be anything from tidying your desk and grabbing a specific beverage to a short meditation session.\n\n3.  **Eliminate All Distractions:** During your deep work block, be ruthless. This means turning off your phone (or leaving it in another room), closing all unnecessary tabs, and disabling notifications. The goal is to make it impossible for distractions to reach you.\n\nBy embracing intensity over volume, you can achieve in a 90-minute deep work session what might otherwise take an entire afternoon of fragmented, shallow efforts. Start small, be consistent, and watch your productivity soar.`,
        linkedin: `Is deep work the key to unlocking your team's full potential?\n\nIn a world of constant digital noise, the ability to focus is a massive competitive advantage. I was listening to an insightful podcast with Dr. Anya Sharma, and she framed it perfectly: "Deep work is like a superpower for the modern knowledge worker."\n\nShe argued against the myth of multitasking and for the power of intense, scheduled focus blocks. The core idea? 90 minutes of truly uninterrupted work can be more productive than a full day of "shallow," distracted efforts.\n\nThis isn't about working more hours; it's about working more intelligently.\n\nAs leaders, how are we creating an environment that encourages and protects deep work for our teams? Are we celebrating "busy-ness" or actual, high-value output?\n\n#Leadership #Productivity #FutureOfWork #DeepWork`,
        email: `Subject: Unlock Your Productivity Superpower: The Art of Deep Work\n\nHi [Name],\n\nIn a world that's constantly vying for our attention, have you ever felt like you're busy all day but not truly productive?\n\nWe're exploring a concept that could be the antidote: Deep Work. It’s the ability to focus without distraction on a cognitively demanding task, and it's a skill that's becoming increasingly rare and valuable.\n\nOn a recent podcast, productivity expert Dr. Anya Sharma shared a powerful insight: treating focus like a meeting. By scheduling "deep work blocks" in your calendar and making yourself completely unreachable, you can achieve in 90 minutes what normally takes a full afternoon.\n\nThe key takeaway is to prioritize intensity over volume. By creating a distraction-free environment, you allow your brain to perform at its peak.\n\nReady to give it a try this week? Block out a single 90-minute session, turn off all notifications, and see what you can accomplish.\n\nBest,\n\nThe ContextMatic Team`,
    };

    const tabs = [
        { id: 'tweet', name: 'Twitter (X) Thread', icon: TwitterIcon },
        { id: 'blog', name: 'Blog Post', icon: BlogIcon },
        { id: 'linkedin', name: 'LinkedIn Post', icon: LinkedInIcon },
        { id: 'email', name: 'Email Newsletter', icon: EmailIcon },
    ];
    
    const getButtonText = () => {
        if(authLoading || fingerprintLoading) return <Spinner />;
        return 'Get Started For Free';
    }

    return (
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 antialiased">
            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-30 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ContextMatic</h1>
                    <button onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow">
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative overflow-hidden">
                <section id="signup-form" className="relative pt-32 pb-20 lg:pt-48 lg:pb-28">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 opacity-60"></div>
                     <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
                     
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                One Piece of Content. <span className="text-indigo-600">Endless Possibilities.</span>
                            </h1>
                            <p className="mt-6 text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                                Stop wasting hours manually reformatting. With ContextMatic, you can instantly repurpose any video, blog post, or idea into engaging social media threads, newsletters, and more.
                            </p>
                        </div>
                        <div className="w-full max-w-md mx-auto">
                            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm shadow-2xl rounded-xl p-8 border border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Create Your Free Account</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                                        <div className="mt-1">
                                            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                                        <select id="country" name="country" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-slate-400 min-h-[20px] text-center pt-4">
                                        {fingerprintLoading && <p>Verifying browser...</p>}
                                        {fingerprintError && <p className="text-red-500">Could not verify browser. Please disable ad-blockers.</p>}
                                        {visitorId && <p className="text-emerald-600">Browser verified successfully.</p>}
                                    </div>
                                    <div>
                                        <button type="submit" disabled={authLoading || fingerprintLoading || !visitorId} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                                            {getButtonText()}
                                        </button>
                                    </div>
                                </form>
                                 <p className="text-center text-xs text-slate-500 mt-4">
                                    By signing up, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-800/50">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                            <p className="text-indigo-600 font-semibold">FEATURES</p>
                            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Work Smarter, Not Harder</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Focus on what you do best—creating. Let our AI handle the rest.</p>
                         </div>
                         <div className="mt-16 grid gap-8 md:grid-cols-3">
                             <div className="text-center p-6 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white"><ClockIcon className="h-6 w-6" /></div>
                                <h3 className="mt-5 text-lg font-medium text-slate-900 dark:text-white">Save Dozens of Hours</h3>
                                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Cut down your content workflow from days to minutes. Automate the tedious task of reformatting and rewriting.</p>
                             </div>
                              <div className="text-center p-6 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white"><TargetIcon className="h-6 w-6" /></div>
                                <h3 className="mt-5 text-lg font-medium text-slate-900 dark:text-white">Reach a Wider Audience</h3>
                                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Effortlessly adapt your core message for different platforms and connect with new communities.</p>
                             </div>
                              <div className="text-center p-6 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-500 text-white"><WandIcon className="h-6 w-6" /></div>
                                <h3 className="mt-5 text-lg font-medium text-slate-900 dark:text-white">Beat Creative Block</h3>
                                <p className="mt-2 text-base text-slate-500 dark:text-slate-400">See your content from a new perspective. Generate fresh angles and ideas with a single click.</p>
                             </div>
                         </div>
                     </div>
                </section>
                
                {/* Use Case Section */}
                <section className="py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-indigo-600 font-semibold uppercase">How It Works</p>
                            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">One Source, Many Platforms</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                                Provide any piece of content—a podcast transcript, a video script, or a simple blog post—and watch as ContextMatic instantly generates perfectly formatted content for all your channels.
                            </p>
                        </div>
                        <div className="mt-16 grid lg:grid-cols-5 gap-8 items-start">
                            {/* Source Content */}
                            <div className="lg:col-span-2 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">1. Start With Your Source Content</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">E.g., a podcast transcript.</p>
                                <div className="mt-4 p-4 h-96 overflow-y-auto bg-white dark:bg-slate-800 rounded-md text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 prose prose-sm dark:prose-invert">
                                    <pre className="whitespace-pre-wrap font-sans">{sourceContent}</pre>
                                </div>
                            </div>
                            {/* Generated Outputs */}
                            <div className="lg:col-span-3 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                 <h3 className="font-bold text-lg text-slate-900 dark:text-white">2. Select Your Desired Outputs</h3>
                                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click a tab to see the AI-generated result.</p>
                                <div className="mt-4">
                                    <div className="border-b border-slate-200 dark:border-slate-700">
                                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.name}
                                                    onClick={() => setActiveTab(tab.id as any)}
                                                    className={`${
                                                        activeTab === tab.id
                                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                                                    } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                                                    aria-current={activeTab === tab.id ? 'page' : undefined}
                                                    >
                                                    <tab.icon className="mr-2 h-5 w-5" /> {tab.name}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>
                                    <div className="mt-4 p-4 h-96 overflow-y-auto bg-white dark:bg-slate-800 rounded-md text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 prose prose-sm dark:prose-invert">
                                        <pre className="whitespace-pre-wrap font-sans">{generatedContent[activeTab]}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                 {/* Testimonials Section */}
                <section className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Loved by Creators & Marketers Worldwide</h2>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                    <QuoteIcon className="h-8 w-8 text-indigo-400" />
                                    <blockquote className="mt-4 text-slate-600 dark:text-slate-300">
                                        <p>“{testimonial.quote}”</p>
                                    </blockquote>
                                    <footer className="mt-6">
                                        <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                                    </footer>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* Footer */}
                <footer className="bg-slate-100 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Join Thousands of Smart Creators</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Start your free trial today. No credit card required.</p>
                         <button onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 px-8 py-3 text-lg font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg transform hover:scale-105">
                            Get Started For Free
                        </button>
                        <p className="mt-10 text-center text-base text-slate-500 dark:text-slate-400">
                           &copy; 2024 ContextMatic. All rights reserved.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;