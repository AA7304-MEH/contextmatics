"use client";

export const dynamic = 'force-dynamic';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { LogoResult } from '@/types';
import { useHistory } from '@/context/HistoryContext';
import { PageLayout } from '@/components/shared';

export default function LogoResultsPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const { addToHistory } = useHistory();
    const [result, setResult] = useState<LogoResult | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storedResult = sessionStorage.getItem('last_logo_result');
        if (storedResult) {
            const parsed = JSON.parse(storedResult);
            setResult(parsed);

            // Auto-save to history once
            if (!isSaved) {
                addToHistory({
                    title: `Logo: ${parsed.prompt.substring(0, 30)}...`,
                    format: 'Logo',
                    content: parsed.imageUrl,
                    status: 'success',
                    icon: '🎨'
                });
                setIsSaved(true);
            }
        } else {
            router.push('/logo-maker');
        }
    }, [router, addToHistory, isSaved]);

    const handleDownload = async () => {
        if (!result) return;

        try {
            showToast('Preparing your high-res logo package...', 'info');
            
            if (result.imageUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = result.imageUrl;
                link.download = `logo-contextmatic-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Open in new tab for external URLs as a more reliable "download" method
                // especially for mobile browsers that block programatic clicks on proxy redirects
                const downloadUrl = `/api/ai/download-logo?url=${encodeURIComponent(result.imageUrl)}`;
                window.open(downloadUrl, '_blank');
            }

            showToast('Download started! 🚀', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            showToast('Download failed. Opening in new tab...', 'error');
            window.open(result.imageUrl, '_blank');
        }
    };

    if (!result) return null;

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <main className="max-w-7xl mx-auto px-6 py-20 text-left">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                            Generation Complete
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                            Your Brand <span className="text-blue-500">Masterpiece</span>
                        </h1>
                        <p className="text-[var(--color-text-secondary)]">
                            Refined, unique, and ready for your next big thing.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className="aspect-square w-full max-w-lg mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img
                                src={result.imageUrl}
                                alt="Generated Logo"
                                className="w-full h-full object-contain p-8"
                                onLoad={() => {}}
                                onError={(e) => {
                                    // Image failed to load, attempting retry
                                    const target = e.target as HTMLImageElement;
                                    if (result.imageUrl.startsWith('http') && !target.src.includes('retry=true')) {
                                        target.src = result.imageUrl + (result.imageUrl.includes('?') ? '&' : '?') + 'retry=true';
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button
                                    onClick={handleDownload}
                                    className="px-6 py-3 bg-white text-black rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                                >
                                    Download high-res
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row gap-4">
                            <button
                                onClick={handleDownload}
                                className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                            >
                                Download Logo Package
                            </button>
                            <button
                                onClick={() => router.push('/logo-maker')}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all text-center flex items-center justify-center active:scale-[0.98]"
                            >
                                Try Another Style
                            </button>
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4 text-sm text-gray-400">
                            <p><span className="font-bold text-gray-300 uppercase tracking-widest text-[10px]">Generated with:</span> ContextMatic AI</p>
                            <p className="text-[10px] opacity-70 border-t border-white/5 pt-4">
                                Image not loading? <a href={result.imageUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Open direct link →</a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 mx-auto transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
