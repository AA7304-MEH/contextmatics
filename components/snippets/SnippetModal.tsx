"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Tag as TagIcon, Globe, Lock } from 'lucide-react';

interface Snippet {
    id?: string;
    title: string;
    content: string;
    tags: string[];
    is_public: boolean;
    source?: string;
}

interface SnippetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (snippet: Snippet) => Promise<void>;
    initialData?: Snippet | null;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData 
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            setTags(initialData.tags || []);
            setIsPublic(initialData.is_public || false);
        } else {
            setTitle('');
            setContent('');
            setTags([]);
            setIsPublic(false);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                id: initialData?.id,
                title,
                content,
                tags,
                is_public: isPublic,
                source: initialData?.source || 'manual'
            });
            onClose();
        } catch (error) {
            console.error('Error saving snippet:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Snippet' : 'Create New Snippet'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A descriptive title for your snippet"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Content</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste or write your AI-generated insight here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all min-h-[200px]"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                <input 
                                    type="text" 
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Press Enter to add tags"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Visibility</label>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(false)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${!isPublic ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'text-text-muted hover:text-white'}`}
                                >
                                    <Lock size={12} /> PRIVATE
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(true)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${isPublic ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'text-text-muted hover:text-white'}`}
                                >
                                    <Globe size={12} /> PUBLIC
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-3 bg-brand-primary rounded-xl text-xs font-bold text-white hover:bg-brand-primary/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : 'Save Snippet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
