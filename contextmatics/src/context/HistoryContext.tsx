import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { Snippet } from '../types';

export interface ContentItem {
    id: string;
    title: string;
    format: string;
    content: string;
    createdAt: Date;
    status: 'success' | 'failed';
    icon: string;
}

interface HistoryContextType {
    historyItems: ContentItem[];
    addToHistory: (item: Omit<ContentItem, 'id' | 'createdAt'>) => void;
    deleteFromHistory: (id: string) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [historyItems, setHistoryItems] = useState<ContentItem[]>([]);
    const { user } = useAuth();
    // const [loading, setLoading] = useState(false);

    // Fetch history from Supabase
    useEffect(() => {
        if (!user) {
            setHistoryItems([]);
            return;
        }

        const fetchHistory = async () => {
            // Mock Data Fallback
            if ((supabase as any).supabaseUrl?.includes('placeholder')) {
                // Return dummy history for testing
                setHistoryItems([
                    {
                        id: 'mock-1',
                        title: 'Mock Video Script',
                        format: 'Video Script',
                        content: 'This is a mock script generated in dev mode.',
                        createdAt: new Date(),
                        status: 'success',
                        icon: '🎬'
                    }
                ]);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('snippets')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mappedItems: ContentItem[] = data.map((snippet: Snippet) => ({
                        id: snippet.id,
                        title: snippet.title,
                        content: snippet.content,
                        format: snippet.tags && snippet.tags.length > 0 ? snippet.tags[0] : 'Unknown',
                        createdAt: new Date(snippet.created_at),
                        status: 'success', // Assuming success if saved
                        icon: getIconForFormat(snippet.tags && snippet.tags.length > 0 ? snippet.tags[0] : 'Unknown')
                    }));
                    setHistoryItems(mappedItems);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                // Don't alert here to avoid spamming user
            }
        };

        fetchHistory();
    }, [user]);

    const addToHistory = async (item: Omit<ContentItem, 'id' | 'createdAt'>) => {
        if (!user) return;

        // Optimistic Update
        const tempId = uuidv4();
        const newItem: ContentItem = {
            ...item,
            id: tempId,
            createdAt: new Date(),
        };
        setHistoryItems((prev) => [newItem, ...prev]);

        try {
            const { data, error } = await supabase
                .from('snippets')
                .insert({
                    user_id: user.id,
                    title: item.title,
                    content: item.content,
                    tags: [item.format],
                    is_public: false
                })
                .select()
                .single();

            if (error) throw error;

            // Replace temp ID with real ID
            if (data) {
                setHistoryItems((prev) => prev.map(i => i.id === tempId ? { ...i, id: data.id } : i));
            }
        } catch (error) {
            console.error('Error adding to history:', error);
            // Revert on error
            setHistoryItems((prev) => prev.filter(i => i.id !== tempId));
        }
    };

    const deleteFromHistory = async (id: string) => {
        // Optimistic Delete
        const prevItems = [...historyItems];
        setHistoryItems((prev) => prev.filter((item) => item.id !== id));

        try {
            const { error } = await supabase
                .from('snippets')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting history:', error);
            setHistoryItems(prevItems);
        }
    };

    const clearHistory = async () => {
        if (!user) return;
        const prevItems = [...historyItems];
        setHistoryItems([]);

        try {
            if (!(supabase as any).supabaseUrl?.includes('placeholder')) {
                const { error } = await supabase
                    .from('snippets')
                    .delete()
                    .eq('user_id', user.id);
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            setHistoryItems(prevItems); // Revert on failure
        }
    };

    // Helper (Duplicated from ContentCreator or utils, ideally moved to utils)
    const getIconForFormat = (format: string) => {
        switch (format) {
            case 'Blog Post': return '📝';
            case 'Twitter Thread': return '🐦';
            case 'Email Newsletter': return '📧';
            case 'LinkedIn Post': return '💼';
            case 'Summary': return '📊';
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
