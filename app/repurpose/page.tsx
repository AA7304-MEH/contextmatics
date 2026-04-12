'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { VerifiedProtection } from '@/components/VerifiedProtection';
import { Twitter, Linkedin, Mail, Link as LinkIcon, RefreshCw, Send } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function RepurposePage() {
    return (
        <VerifiedProtection>
            <RepurposeContent />
        </VerifiedProtection>
    );
}

function RepurposeContent() {
    const { user, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [inputSource, setInputSource] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<{ twitter?: string, linkedin?: string, newsletter?: string } | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleRepurpose = async () => {
        if (!inputSource.trim()) {
            showToast('Please enter text or a URL', 'warning');
            return;
        }
        
        if (!user || user.credits_remaining < 3) {
            showToast('Insufficient credits (requires 3).', 'error');
            router.push('/pricing');
            return;
        }

        let contentObj = inputSource;

        // Auto-extract URL
        if (inputSource.trim().startsWith('http://') || inputSource.trim().startsWith('https://')) {
            setIsExtracting(true);
            try {
                const extRes = await fetch('/api/repurpose/extract', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: inputSource.trim() })
                });
                const extData = await extRes.json();
                if (!extRes.ok) throw new Error(extData.error || 'Failed to extract URL');
                contentObj = extData.text;
                showToast('Content successfully extracted from URL!', 'success');
            } catch (err: any) {
                showToast(err.message || 'Error extracting URL', 'error');
                setIsExtracting(false);
                return;
            }
            setIsExtracting(false);
        }

        setIsGenerating(true);
        setResults(null);
        try {
            const res = await fetch('/api/repurpose/generate-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentObj })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Generation failed');
            
            setResults({
                twitter: data.twitter,
                linkedin: data.linkedin,
                newsletter: data.newsletter
            });
            await refreshProfile();
            showToast('Repurposed across 3 platforms successfully! ✨', 'success');
        } catch (err: any) {
            showToast(err.message || 'An error occurred during generation', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveToCalendar = async (content: string, platform: string) => {
        const scheduleDate = new Date();
        scheduleDate.setDate(scheduleDate.getDate() + 1);

        try {
            const { error } = await supabase.from('scheduled_posts').insert({
                user_id: user?.id,
                content: content,
                platforms: [platform.toLowerCase()],
                status: 'scheduled',
                scheduled_at: scheduleDate.toISOString()
            });
            if (error) throw error;
            showToast(`Saved to ${platform} calendar! 📅`, 'success');
        } catch(e: any) {
            showToast(e.message || `Failed to schedule ${platform}`, 'error');
        }
    };

    const updateResult = (platform: keyof typeof results, value: string) => {
        setResults(prev => prev ? { ...prev, [platform]: value } : null);
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12">
                <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Content Repurposer</h1>
                        <p className="text-lg text-text-secondary">Turn 1 piece of content into 3 viral posts instantly.</p>
                    </div>
                </div>

                <div className="card p-8 bg-background-surface/50 border border-white/5 mb-12 max-w-4xl mx-auto">
                    <label className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 block">
                        Source Material (URL or Paste Text)
                    </label>
                    <div className="relative">
                        <textarea
                            value={inputSource}
                            onChange={(e) => setInputSource(e.target.value)}
                            placeholder="Paste your blog article, notes, or any valid HTTP URL..."
                            className="input w-full min-h-[120px] py-4 leading-relaxed resize-y bg-black/20 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/50 outline-none text-text-primary text-base placeholder-text-muted"
                        />
                        {inputSource.trim().startsWith('http') && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                                <LinkIcon className="w-3 h-3" />
                                URL Detected (Will auto-scrape)
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleRepurpose}
                            disabled={isExtracting || isGenerating || !inputSource.trim()}
                            className={`btn py-4 px-10 text-base font-semibold tracking-wide flex items-center justify-center gap-2 min-w-[240px] ${(isExtracting || isGenerating) || !inputSource.trim() ? 'opacity-50 cursor-not-allowed bg-white/5 text-text-secondary border-white/10' : 'btn-primary shadow-lg hover:shadow-brand-primary/20'}`}
                        >
                            {isExtracting ? (
                                <><RefreshCw className="w-5 h-5 animate-spin" /> Extracting URL...</>
                            ) : isGenerating ? (
                                <><RefreshCw className="w-5 h-5 animate-spin" /> Repurposing Content...</>
                            ) : (
                                <><RefreshCw className="w-5 h-5" /> Repurpose Now ✨</>
                            )}
                        </button>
                    </div>
                </div>

                {results && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Generated Platforms</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Twitter */}
                            <div className="card p-6 bg-background-surface/50 border border-white/5 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1DA1F2]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center">
                                        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Twitter Thread</h3>
                                </div>
                                <textarea
                                    value={results.twitter}
                                    onChange={(e) => updateResult('twitter', e.target.value)}
                                    className="input flex-1 w-full min-h-[300px] p-4 bg-black/30 border border-white/5 rounded-xl resize-y text-sm font-mono leading-relaxed mb-4"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(results.twitter || ''); showToast('Copied!', 'success'); }} className="btn btn-secondary flex-1 py-2 text-xs">Copy</button>
                                    <button onClick={() => handleSaveToCalendar(results.twitter!, 'Twitter')} className="btn btn-primary flex-1 py-2 text-xs gap-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 border-transparent text-white">
                                        <Send className="w-3 h-3" /> Schedule
                                    </button>
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="card p-6 bg-background-surface/50 border border-white/5 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A66C2]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 flex items-center justify-center">
                                        <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                                    </div>
                                    <h3 className="font-semibold text-lg">LinkedIn Post</h3>
                                </div>
                                <textarea
                                    value={results.linkedin}
                                    onChange={(e) => updateResult('linkedin', e.target.value)}
                                    className="input flex-1 w-full min-h-[300px] p-4 bg-black/30 border border-white/5 rounded-xl resize-y text-sm font-sans leading-relaxed mb-4"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(results.linkedin || ''); showToast('Copied!', 'success'); }} className="btn btn-secondary flex-1 py-2 text-xs">Copy</button>
                                    <button onClick={() => handleSaveToCalendar(results.linkedin!, 'LinkedIn')} className="btn btn-primary flex-1 py-2 text-xs gap-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90 border-transparent text-white">
                                        <Send className="w-3 h-3" /> Schedule
                                    </button>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="card p-6 bg-background-surface/50 border border-white/5 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Newsletter</h3>
                                </div>
                                <textarea
                                    value={results.newsletter}
                                    onChange={(e) => updateResult('newsletter', e.target.value)}
                                    className="input flex-1 w-full min-h-[300px] p-4 bg-black/30 border border-white/5 rounded-xl resize-y text-sm font-serif leading-relaxed mb-4"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(results.newsletter || ''); showToast('Copied!', 'success'); }} className="btn btn-secondary flex-1 py-2 text-xs">Copy</button>
                                    <button onClick={() => handleSaveToCalendar(results.newsletter!, 'Email')} className="btn btn-primary flex-1 py-2 text-xs gap-1 bg-emerald-600 hover:bg-emerald-500 border-transparent text-white">
                                        <Send className="w-3 h-3" /> Schedule
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
