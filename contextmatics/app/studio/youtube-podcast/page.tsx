'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
    Youtube, 
    Upload, 
    Link as LinkIcon, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    RefreshCw, 
    ArrowRight,
    FileAudio,
    Sparkles
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { RepurposeJob } from '@/types/database';

export default function YoutubePodcastStudio() {
    const router = useRouter();
    useAuth();
    const { showToast } = useToast();
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<RepurposeJob | null>(null);
    const [polling, setPolling] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleStart = async () => {
        if (!url.trim()) {
            showToast('Please enter a YouTube URL', 'warning');
            return;
        }

        setIsProcessing(true);
        setJobId(null);
        setStatus(null);

        try {
            const res = await fetch('/api/repurpose/youtube', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to start processing');

            setJobId(data.data.jobId);
            setPolling(true);
            showToast('Processing started! This may take a few minutes.', 'success');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            showToast(msg, 'error');
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (polling && jobId) {
            interval = setInterval(async () => {
                const { data, error } = await supabase
                    .from('repurpose_jobs')
                    .select('*')
                    .eq('id', jobId)
                    .single();

                if (error) {
                    console.error('Polling error:', error);
                    return;
                }

                const job = data as RepurposeJob;
                setStatus(job);

                if (job.status === 'complete' || job.status === 'failed') {
                    setPolling(false);
                    setIsProcessing(false);
                    if (job.status === 'complete') {
                        showToast('Transcription complete! Ready to repurpose.', 'success');
                    } else {
                        showToast('Processing failed. Please check the logs.', 'error');
                    }
                }
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [polling, jobId, supabase]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <PageLayout>
            <SEO 
                title="YouTube & Podcast Studio" 
                description="Turn your long videos and podcasts into viral social content with AI transcription and chunking." 
            />
            
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
                        <Youtube className="w-3 h-3" />
                        Repurpose Studio
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-white">
                        YouTube & <span className="text-kinetic">Podcast</span> Studio
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Extract the gold from your long-form content. We chunk, transcribe, and repurpose your videos automatically.
                    </p>
                </div>

                {/* Input Card */}
                <div className="card bg-zinc-900/50 border-white/5 space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Youtube className="w-32 h-32 text-red-500" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-brand-primary" />
                                Paste Video/Audio URL
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="input py-4 pr-32 text-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:border-white/20 transition-all"
                                />
                                <button 
                                    onClick={handleStart}
                                    disabled={isProcessing || !url.trim()}
                                    className="absolute right-2 top-2 bottom-2 px-6 btn btn-primary flex items-center gap-2 font-bold"
                                >
                                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Start</>}
                                </button>
                            </div>
                        </div>

                        {/* File Upload Alternative */}
                        <div className="flex items-center gap-4 py-4">
                            <div className="h-px flex-grow bg-white/5"></div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">or</span>
                            <div className="h-px flex-grow bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                                <Upload className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">Upload Audio</p>
                                    <p className="text-[10px] text-text-secondary">MP3, WAV, M4A up to 100MB</p>
                                </div>
                            </button>
                            <button className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                                <FileAudio className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">Upload Video</p>
                                    <p className="text-[10px] text-text-secondary">MP4, MOV up to 250MB</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Warnings */}
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-4 items-start">
                        <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-amber-200">Processing Time Note</p>
                            <p className="text-xs text-amber-200/60 leading-relaxed">
                                Long videos (60+ minutes) may take 3-5 minutes to process as we chunk the audio for maximum transcription accuracy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                {status && (
                    <div className="animate-fade-in-up card border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status.status === 'complete' ? 'bg-emerald-500' : (status.status === 'failed' ? 'bg-red-500' : 'bg-brand-primary animate-pulse')}`}>
                                    {status.status === 'complete' ? <CheckCircle2 className="w-6 h-6 text-black" /> : <RefreshCw className="w-6 h-6 text-white animate-spin" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white capitalize">{status.status}</h3>
                                    <p className="text-sm text-text-secondary">
                                        {status.status === 'processing' 
                                            ? 'Transcribing and chunking content...'
                                            : status.status === 'complete' 
                                            ? 'Everything is ready!' 
                                            : 'Something went wrong.'}
                                    </p>
                                </div>
                            </div>

                            {status.status === 'complete' && (
                                <button 
                                    onClick={() => {
                                        if (status.transcript) {
                                            localStorage.setItem('repurpose_content', status.transcript);
                                        }
                                        router.push('/content-creator');
                                    }}
                                    className="btn btn-primary px-8 py-3 font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                >
                                    Repurpose Content <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {status.status === 'failed' && (
                            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                                <AlertTriangle className="w-5 h-5" />
                                <p className="text-sm font-medium">Job processing failed. Please check your source URL or try again.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Preview transcript if processing */}
                {status?.transcript && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Live Transcript Preview</h3>
                            <span className="text-[10px] text-text-muted">{status.transcript.split(' ').length} words captured</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 min-h-[200px] max-h-[400px] overflow-y-auto">
                            <p className="text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                                {status.transcript}
                                <span className="inline-block w-2 h-4 bg-brand-primary ml-1 animate-pulse"></span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
