"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

export interface ContentItem {
    id: string;
    title: string;
    format: string;
    content: string;
    created_at: Date;
    user_id: string;
    status: 'success' | 'failed';
    icon: string;
}

interface HistoryContextType {
    historyItems: ContentItem[];
    addToHistory: (item: Omit<ContentItem, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
    deleteFromHistory: (id: string) => Promise<void>;
    clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [historyItems, setHistoryItems] = useState<ContentItem[]>([]);
    const { user } = useAuth();

    const fetchHistory = async () => {
        if (!user) {
            setHistoryItems([]);
            return;
        }

        try {
            const response = await fetch('/api/snippets');
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();

            if (data) {
                const mappedItems: ContentItem[] = data.map((snippet: any) => ({
                    id: snippet.id,
                    title: snippet.title,
                    content: snippet.content,
                    format: snippet.tags && snippet.tags.length > 0 ? snippet.tags[0] : 'Unknown',
                    created_at: new Date(snippet.created_at),
                    user_id: snippet.user_id,
                    status: 'success',
                    icon: getIconForFormat(snippet.tags && snippet.tags.length > 0 ? snippet.tags[0] : 'Unknown')
                }));
                setHistoryItems(mappedItems);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const addToHistory = async (item: Omit<ContentItem, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;

        try {
            const response = await fetch('/api/snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: item.title,
                    content: item.content,
                    tags: [item.format],
                }),
            });

            if (!response.ok) throw new Error('Failed to save snippet');
            await fetchHistory();
        } catch (error) {
            console.error('Error adding to history:', error);
        }
    };

    const deleteFromHistory = async (id: string) => {
        if (!user) return;

        try {
            const response = await fetch(`/api/snippets/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete snippet');
            setHistoryItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting history:', error);
        }
    };

    const clearHistory = async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('snippets')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;
            setHistoryItems([]);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    const getIconForFormat = (format: string) => {
        switch (format) {
            case 'Blog Post': return '📝';
            case 'Twitter Thread': return '🐦';
            case 'Email Newsletter': return '📧';
            case 'LinkedIn Post': return '💼';
            case 'Summary': return '📊';
            case 'Logo': return '🎨';
            default: return '📄';
        }
    };

    return (
        <HistoryContext.Provider value={{ historyItems, addToHistory, deleteFromHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
