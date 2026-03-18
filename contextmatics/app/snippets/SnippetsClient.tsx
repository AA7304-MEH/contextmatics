"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { Search, Plus, Filter, MoreVertical, Copy, Trash2, Video, Globe, Lock, ExternalLink, Scissors, Edit2 } from 'lucide-react';
import { SnippetModal } from '@/components/snippets/SnippetModal';

interface Snippet {
    id: string;
    title: string;
    content: string;
    tags: string[];
    is_public: boolean;
    source: string;
    created_at: string;
}

export default function SnippetsClient() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

    useEffect(() => {
        if (!user) return;
        fetchSnippets();
    }, [user]);

    const fetchSnippets = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/snippets');
            if (response.ok) {
                const data = await response.json();
                setSnippets(data);
            }
        } catch (error) {
            console.error('Error fetching snippets:', error);
            showToast('Failed to load snippets', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSnippet = async (snippetData: any) => {
        try {
            const isEditing = !!snippetData.id;
            const url = isEditing ? `/api/snippets/${snippetData.id}` : '/api/snippets';
            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(snippetData)
            });

            if (response.ok) {
                const savedSnippet = await response.json();
                if (isEditing) {
                    setSnippets(prev => prev.map(s => s.id === savedSnippet.id ? savedSnippet : s));
                    showToast('Snippet updated successfully', 'success');
                } else {
                    setSnippets(prev => [savedSnippet, ...prev]);
                    showToast('Snippet created successfully', 'success');
                }
                setIsModalOpen(false);
            } else {
                const error = await response.text();
                showToast(error || 'Failed to save snippet', 'error');
            }
        } catch (error) {
            console.error('Error saving snippet:', error);
            showToast('An unexpected error occurred', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this snippet?')) return;
        try {
            const response = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setSnippets(prev => prev.filter(s => s.id !== id));
                showToast('Snippet deleted', 'success');
            }
        } catch (error) {
            showToast('Failed to delete snippet', 'error');
        }
    };

    const handleGenerateVideo = async (snippet: Snippet) => {
        showToast('Initiating AI Video Generation...', 'info');
        try {
            const response = await fetch('/api/video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: snippet.content,
                    style: 'cinematic', // Default style
                    platform: 'shorts',
                    snippetId: snippet.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                showToast('Video generation started!', 'success');
                router.push(`/studio/${data.projectId}`);
            } else {
                const error = await response.text();
                showToast(error || 'Generation failed', 'error');
            }
        } catch (error) {
            showToast('Connection error', 'error');
        }
    };

    const handleCreateProject = async (snippet: Snippet) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Project: ${snippet.title}`,
                    description: `Derived from snippet: ${snippet.title}`,
                    timeline_data: {
                        tracks: [
                            { id: 'v1', type: 'video', name: 'Main Video', order: 0 }
                        ],
                        clips: [], // User can add snippets manually in editor
                        duration: 60,
                        zoom: 1
                    }
                })
            });

            if (response.ok) {
                const project = await response.json();
                router.push(`/studio/${project.id}`);
            }
        } catch (error) {
            showToast('Failed to create project', 'error');
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        showToast('Copied to clipboard', 'success');
    };

    const openEditModal = (snippet: Snippet) => {
        setSelectedSnippet(snippet);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedSnippet(null);
        setIsModalOpen(true);
    };

    const tags = ['All', ...Array.from(new Set(snippets.flatMap(s => s.tags || [])))];

    const filteredSnippets = snippets.filter(s => {
        const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === 'All' || s.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    if (loading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Snippet Library</h1>
                        <p className="text-text-secondary text-lg">Manage and repurpose your AI-generated insights.</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={openCreateModal}
                            className="btn btn-primary flex items-center gap-2 px-6"
                        >
                            <Plus size={18} />
                            Create New
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search snippets..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                    selectedTag === tag 
                                    ? 'bg-brand-primary/10 border border-brand-primary/50 text-white' 
                                    : 'bg-white/5 border border-white/5 text-text-muted hover:bg-white/10'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid View */}
                {filteredSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSnippets.map((snippet) => (
                            <div key={snippet.id} className="group card bg-background-surface/30 border border-white/5 hover:border-brand-primary/30 transition-all p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2">
                                        {snippet.is_public ? (
                                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                                                <Globe size={10} /> Public
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                                                <Lock size={10} /> Private
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleCopy(snippet.content)}
                                            className="p-1.5 rounded-md hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                                            title="Copy Content"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button 
                                            onClick={() => openEditModal(snippet)}
                                            className="p-1.5 rounded-md hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(snippet.id)}
                                            className="p-1.5 rounded-md hover:bg-white/10 text-text-muted hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                    {snippet.title || 'Untitled Snippet'}
                                </h3>
                                
                                <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-4 leading-relaxed">
                                    {snippet.content}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {snippet.tags?.map(t => (
                                        <span key={t} className="text-[10px] font-semibold text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            #{t}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/5 flex gap-2">
                                    <button 
                                        className="btn btn-secondary flex-1 text-xs py-2 flex items-center justify-center gap-2"
                                        onClick={() => handleCreateProject(snippet)}
                                    >
                                        <Scissors size={14} />
                                        Create Project
                                    </button>
                                    <button 
                                        className="btn btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-2"
                                        onClick={() => handleGenerateVideo(snippet)}
                                    >
                                        <Video size={14} />
                                        Gen Video
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="mb-6 inline-flex p-6 rounded-full bg-brand-primary/10 text-brand-primary">
                            {searchTerm ? <Search size={48} /> : <Plus size={48} />}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {searchTerm ? 'No snippets found' : 'Your library is empty'}
                        </h3>
                        <p className="text-text-secondary max-w-sm mx-auto mb-8">
                            {searchTerm ? "Try searching for something else or clear the filters." : "Start by creating some content in the AI Creator or import your snippets."}
                        </p>
                        {!searchTerm && (
                            <button 
                                onClick={openCreateModal}
                                className="btn btn-primary px-8"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                )}
            </div>

            <SnippetModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSnippet}
                initialData={selectedSnippet}
            />
        </PageLayout>
    );
}
