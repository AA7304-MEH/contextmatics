"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { VerifiedProtection } from '@/components/VerifiedProtection';
import { useCompletion } from '@ai-sdk/react';
import { createBrowserClient } from '@supabase/ssr';

export default function ContentCreatorPage() {
    return (
        <VerifiedProtection>
            <ContentCreatorContent />
        </VerifiedProtection>
    );
}

function ContentCreatorContent() {
    const { user, refreshProfile, currentWorkspace } = useAuth();
    const { addToHistory: _addToHistory } = useHistory();
    const { showToast } = useToast();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'text' | 'media'>('text');

    // Text Generation State
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('LinkedIn');
    const [contentType, setContentType] = useState('Post');
    const [tone, setTone] = useState('Professional');
    const [length, setLength] = useState('Medium');
    const [advancedInfo, setAdvancedInfo] = useState('');
    const [brandVoice, setBrandVoice] = useState('');
    const [language, setLanguage] = useState('English');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // AI SDK hook
    const { completion, input: _input, handleInputChange, handleSubmit, isLoading, setCompletion } = useCompletion({
        api: '/api/ai/generate',
        body: {
            topic,
            platform,
            contentType,
            tone,
            length,
            advancedInfo,
            brandVoice,
            language,
            workspace_id: currentWorkspace?.id
        },
        onFinish: async (_prompt, _result) => {
            await refreshProfile();
            showToast('Content successfully generated ✨', 'success');
        },
        onError: (err) => {
            console.error(err);
            if (err.message.includes('402')) {
                showToast('Insufficient credits. Please upgrade.', 'error');
                router.push('/pricing');
            } else {
                showToast(err.message || 'Generation failed.', 'error');
            }
        }
    });

    // Media Generation State
    const [mediaType, setMediaType] = useState<'image' | 'logo' | 'video' | 'repurpose'>('image');
    const [mediaPrompt, setMediaPrompt] = useState('');
    const [mediaStyle, _setMediaStyle] = useState('minimalist');
    const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
    const [mediaResult, setMediaResult] = useState<{ url: string, type: string } | null>(null);

    // Load templates/profiles on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const templatePrompt = sessionStorage.getItem('template_prompt');
            if (templatePrompt) {
                setTopic(templatePrompt);
                sessionStorage.removeItem('template_prompt');
                sessionStorage.removeItem('template_name');
            }
        }
        if (user) {
            async function fetchProfile() {
                // Prioritize Workspace settings if active
                if (currentWorkspace) {
                    if (currentWorkspace.brand_description) setBrandVoice(currentWorkspace.brand_description);
                    if (currentWorkspace.brand_voice) setTone(currentWorkspace.brand_voice);
                } else {
                    const { data } = await supabase.from('profiles').select('brand_description, brand_voice').eq('id', user!.id).single();
                    if (data?.brand_description) setBrandVoice(data.brand_description);
                    if (data?.brand_voice) setTone(data.brand_voice);
                }
            }
            fetchProfile();
        }
    }, [user, supabase, currentWorkspace]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            showToast('Please enter a topic', 'warning');
            return;
        }
        if (user && user.credits_remaining < 1) {
            showToast('No credits remaining! Please upgrade your plan.', 'error');
            router.push('/pricing');
            return;
        }
        setCompletion(''); // clear previous
        handleInputChange({ target: { value: topic } } as any); // AI SDK needs input state to trigger submit sometimes, but empty dummy is fine since we use body.
        handleSubmit(e);
    };

    const handleSaveToCalendar = async () => {
        if (!completion) return;
        
        const scheduleDate = new Date();
        scheduleDate.setDate(scheduleDate.getDate() + 1); // schedule for tomorrow

        try {
            const { error } = await supabase.from('scheduled_posts').insert({
                user_id: user?.id,
                content: completion,
                platforms: [platform.toLowerCase()],
                status: 'scheduled',
                scheduled_at: scheduleDate.toISOString()
            });
            if (error) throw error;
            showToast('Saved to calendar! 📅', 'success');
            router.push('/calendar');
        } catch(e:any) {
            showToast(e.message || 'Failed to schedule', 'error');
        }
    };

    const handleGenerateMedia = async () => {
        if (!mediaPrompt.trim() && mediaType !== 'repurpose') {
            showToast('Please enter a prompt', 'warning');
            return;
        }

        const cost = mediaType === 'video' || mediaType === 'repurpose' ? 15 : 5;
        if (!user || user.credits_remaining < cost) {
            showToast(`Insufficient credits! This action requires ${cost} credits.`, 'error');
            router.push('/pricing');
            return;
        }

        setIsGeneratingMedia(true);
        setMediaResult(null);

        try {
            const endpoint = `/api/generate-${mediaType === 'repurpose' ? 'video' : mediaType}`;
            const body = mediaType === 'repurpose' 
                ? { prompt: completion } 
                : { prompt: mediaPrompt, style: mediaStyle };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Generation failed');

            setMediaResult({ url: data.url, type: mediaType });
            await refreshProfile();
            showToast(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} generated successfully! ✨`, 'success');
        } catch (error:any) {
            showToast(error.message || 'Failed to generate media', 'error');
        } finally {
            setIsGeneratingMedia(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(completion);
        showToast('Copied to clipboard!', 'success');
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 h-[calc(100vh-80px)] flex flex-col">
                <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Content Generator</h1>
                        <p className="text-md text-text-secondary">Streamlined content creation suite.</p>
                    </div>
                    {/* Tabs */}
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                        <button
                            onClick={() => setActiveTab('text')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-brand-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            📝 Write Post
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'media' ? 'bg-brand-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            🎨 Media Studio
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    {activeTab === 'text' ? (
                        <div className="flex flex-col lg:flex-row gap-6 h-full absolute inset-0">
                            {/* LEFT PANEL: Form */}
                            <div className="w-full lg:w-1/3 flex flex-col bg-background-surface/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl h-full">
                                <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                    <h3 className="font-semibold">Generation Settings</h3>
                                </div>
                                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                                    <div>
                                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Topic / Concept</label>
                                        <textarea
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="What should we write about? E.g. Top 5 ways to use AI for marketing..."
                                            className="input w-full h-24 p-3 bg-black/20 border-white/10 rounded-xl resize-none text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Platform</label>
                                            <select value={platform} onChange={e => setPlatform(e.target.value)} className="input w-full p-3 bg-black/20 border-white/10 rounded-xl text-sm">
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Twitter">Twitter/X</option>
                                                <option value="Blog">Blog</option>
                                                <option value="Email">Email</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Type</label>
                                            <select value={contentType} onChange={e => setContentType(e.target.value)} className="input w-full p-3 bg-black/20 border-white/10 rounded-xl text-sm">
                                                <option value="Post">Standard Post</option>
                                                <option value="Thread">Thread</option>
                                                <option value="Article">Article</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Tone</label>
                                            <select value={tone} onChange={e => setTone(e.target.value)} className="input w-full p-3 bg-black/20 border-white/10 rounded-xl text-sm">
                                                <option value="Professional">Professional</option>
                                                <option value="Casual & Fun">Casual & Fun</option>
                                                <option value="Bold & Direct">Bold & Direct</option>
                                                <option value="Educational">Educational</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Length</label>
                                            <select value={length} onChange={e => setLength(e.target.value)} className="input w-full p-3 bg-black/20 border-white/10 rounded-xl text-sm">
                                                <option value="Short">Short</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Long">Long</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Language</label>
                                            <select value={language} onChange={e => setLanguage(e.target.value)} className="input w-full p-3 bg-black/20 border-white/10 rounded-xl text-sm">
                                                <option value="English">English</option>
                                                <option value="Hinglish">Hinglish 🇮🇳</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block text-left">Advanced Guidelines (Optional)</label>
                                        <textarea
                                            value={advancedInfo}
                                            onChange={(e) => setAdvancedInfo(e.target.value)}
                                            placeholder="Keywords to include, specific CTA..."
                                            className="input w-full h-20 p-3 bg-black/20 border-white/10 rounded-xl resize-none text-sm"
                                        />
                                    </div>
                                    
                                    <div className="pt-2">
                                         <button
                                            type="submit"
                                            disabled={isLoading || !topic.trim()}
                                            className={`btn w-full py-4 text-base font-semibold tracking-wide justify-center ${isLoading || !topic.trim() ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10 text-text-secondary' : 'btn-primary'}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Writing...
                                                </span>
                                            ) : 'Generate Now ✨'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* RIGHT PANEL: Streaming Output */}
                            <div className="w-full lg:w-2/3 flex flex-col bg-background-surface/30 border border-brand-primary/10 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.03)] h-full overflow-hidden relative">
                                <div className="p-4 border-b border-brand-primary/10 flex justify-between items-center bg-black/20">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live Editor
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={copyToClipboard} disabled={!completion} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 transition">Copy</button>
                                        <button onClick={handleSaveToCalendar} disabled={!completion || isLoading} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 transition flex flex-center gap-1">
                                            📅 Save to Calendar
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative text-left">
                                    {!completion && !isLoading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary opacity-50">
                                            <span className="text-4xl mb-4">🚀</span>
                                            <p className="text-sm">Ready to generate your next viral hit.</p>
                                        </div>
                                    ) : (
                                        <div className="prose prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap font-mono relative pr-4">
                                            {completion}
                                            {isLoading && <span className="inline-block w-2 h-4 bg-brand-primary ml-1 animate-pulse"></span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                            <div className="card p-6 bg-background-surface/50 border border-white/5 text-left h-fit">
                                <div className="mb-8">
                                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">Media Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'image', label: 'Image', cost: 5 },
                                            { id: 'logo', label: 'Logo', cost: 5 },
                                            { id: 'video', label: 'Video', cost: 15 }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setMediaType(t.id as any)}
                                                className={`p-3 rounded-lg border text-sm text-center font-medium transition-all ${mediaType === t.id ? 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' : 'border-white/5 bg-white/5 hover:bg-white/10 relative text-text-secondary'}`}
                                            >
                                                {t.label} 
                                                <span className="block text-[10px] mt-1 opacity-70 border border-current w-fit mx-auto px-1.5 rounded">{t.cost} cr</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Prompt</label>
                                    <textarea
                                        value={mediaPrompt}
                                        onChange={(e) => setMediaPrompt(e.target.value)}
                                        placeholder={mediaType === 'image' ? "Sunset over a futuristic city..." : "Tech startup named CloudFlow..."}
                                        className="input w-full h-32 p-4 bg-black/20 border-white/10 rounded-xl resize-none text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerateMedia}
                                    disabled={isGeneratingMedia || !mediaPrompt.trim()}
                                    className={`btn w-full py-3 justify-center ${isGeneratingMedia || !mediaPrompt.trim() ? 'opacity-50 cursor-not-allowed bg-white/5' : 'btn-primary'}`}
                                >
                                    {isGeneratingMedia ? 'Generating...' : `Generate ${mediaType} ✨`}
                                </button>
                            </div>

                            <div className="card bg-black/40 border border-white/5 flex items-center justify-center p-4 h-fit min-h-[400px]">
                                {mediaResult ? (
                                    <div className="w-full text-center">
                                        {mediaResult.type === 'video' ? (
                                            <video src={mediaResult.url} controls autoPlay className="w-full rounded-xl border border-white/10" />
                                        ) : (
                                            <img src={mediaResult.url} className="w-full max-h-[500px] object-contain rounded-xl border border-white/10 mx-auto" />
                                        )}
                                        <button onClick={() => window.open(mediaResult.url)} className="mt-4 text-xs font-medium text-brand-primary hover:underline">Download Original</button>
                                    </div>
                                ) : (
                                    <div className="text-center text-text-secondary opacity-50">
                                        <span>🎨</span>
                                        <p className="text-xs mt-2">Media preview will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
