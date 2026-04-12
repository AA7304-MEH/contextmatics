"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { createBrowserClient } from '@supabase/ssr';

export default function MediaLibraryPage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [filterType, setFilterType] = useState('all');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    useEffect(() => {
        if (!loading && user) {
            fetchMedia();
        } else if (!loading && !user) {
            router.push('/sign-in');
        }
    }, [user, loading, filterType]);

    const fetchMedia = async () => {
        setIsFetching(true);
        try {
            let query = supabase
                .from('media_items')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (filterType !== 'all') {
                query = query.eq('type', filterType);
            }

            const { data, error } = await query;

            if (error) throw error;
            setMediaItems(data || []);
        } catch (error: any) {
            console.error('Error fetching media:', error);
            showToast('Failed to load media library', 'error');
        } finally {
            setIsFetching(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('media_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMediaItems(mediaItems.filter(item => item.id !== id));
            showToast('Item deleted', 'success');
        } catch (error: any) {
            showToast('Failed to delete item', 'error');
        }
    };

    const getTimeAgo = (date: string) => {
        const diff = new Date().getTime() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading || isFetching) {
        return (
            <PageLayout>
                <div className="container mx-auto px-6 py-20 text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading your masterpiece...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold text-white mb-2">Media Library</h1>
                        <p className="text-text-secondary">Your collection of AI-generated visuals and videos.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-black/40 p-1 rounded-xl border border-white/10">
                        {['all', 'image', 'logo', 'video'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filterType === type ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-white'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {mediaItems.length === 0 ? (
                    <div className="card p-20 text-center border-dashed border-2 border-white/5 bg-white/5">
                        <span className="text-6xl mb-6 block">🎨</span>
                        <h2 className="text-2xl font-bold text-white mb-2">Empty Library</h2>
                        <p className="text-text-secondary mb-8">Start generating some media to see it here!</p>
                        <button 
                            onClick={() => router.push('/content-creator')}
                            className="btn btn-primary"
                        >
                            Create Something ✨
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mediaItems.map((item) => (
                            <div key={item.id} className="card group bg-background-surface/50 border border-white/5 overflow-hidden hover:border-white/20 transition-all flex flex-col">
                                <div className="aspect-square bg-black/40 relative overflow-hidden flex items-center justify-center">
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button 
                                            onClick={() => window.open(item.url, '_blank')}
                                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                                            title="View / Download"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                        {item.type}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between text-left">
                                    <div>
                                        <p className="text-sm text-white font-medium line-clamp-2 mb-2" title={item.prompt}>
                                            {item.prompt}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] text-text-muted">{getTimeAgo(item.created_at)}</span>
                                        <span className="text-[10px] text-brand-primary font-bold uppercase">Success</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
