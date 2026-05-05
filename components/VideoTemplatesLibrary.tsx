"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface VideoTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    preview_url: string;
    project_data:any;
}

const VideoTemplatesLibrary: React.FC = () => {
    const { showToast } = useToast();
    const router = useRouter();
    const [templates, setTemplates] = useState<VideoTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [recommendedId, setRecommendedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .eq('is_public', true);

            if (error) {
                console.error('Error fetching templates:', error);
            } else {
                setTemplates(data || []);
            }
            setLoading(false);
        };

        fetchTemplates();

        // Check for recommended template in URL
        const params = new URLSearchParams(window.location.search);
        setRecommendedId(params.get('recommended'));
    }, []);

    const useTemplate = async (template: VideoTemplate, isRemix: boolean = false) => {
        try {
            sessionStorage.setItem('active_project_template', JSON.stringify(template.project_data));
            if (isRemix) {
                showToast(`Remixing "${template.name}"...`, 'success');
            } else {
                showToast(`Loading "${template.name}" template...`, 'success');
            }
            router.push('/video-editor');
        } catch (error) {
            showToast('Failed to load template.', 'error');
        }
    };

    const categories = ['all', 'TikTok', 'Reels', 'YouTube', 'Marketing', 'Educational'];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Video Templates</h1>
                        <p className="text-zinc-400 text-lg">Pick a professional template or remix a community favorite.</p>
                    </div>
                    {recommendedId && (
                        <div className="bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-xl flex items-center gap-3 animate-pulse">
                            <span className="text-indigo-400 text-sm font-bold">✨ Recommended for your content</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-[#00c8ff] text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTemplates.map((template: VideoTemplate) => (
                            <div
                                key={template.id}
                                className={`group relative bg-white/5 rounded-2xl overflow-hidden border transition-all ${template.id === recommendedId
                                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {template.id === recommendedId && (
                                    <div className="absolute top-4 left-4 z-20 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                                        MATCHED
                                    </div>
                                )}

                                <div className="aspect-video bg-black relative overflow-hidden">
                                    {template.preview_url && (
                                        <video
                                            src={template.preview_url}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            muted
                                            loop
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); useTemplate(template, true); }}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/20"
                                        >
                                            Remix
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); useTemplate(template); }}
                                            className="bg-[#00c8ff] hover:bg-[#00e1ff] text-black text-xs font-bold px-4 py-2 rounded-lg"
                                        >
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white">{template.name}</h3>
                                        <span className="text-[10px] font-bold text-white/40 border border-white/10 px-2 py-1 rounded uppercase">
                                            {template.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{template.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredTemplates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold text-white mb-2">No templates found in this category</h3>
                        <p className="text-zinc-500">Check back later or try another category.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default VideoTemplatesLibrary;
