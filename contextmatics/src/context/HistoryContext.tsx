import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    const [historyItems, setHistoryItems] = useState<ContentItem[]>(() => {
        const savedHistory = localStorage.getItem('contentHistory');
        if (savedHistory) {
            try {
                // Parse dates back to Date objects
                return JSON.parse(savedHistory, (key, value) => {
                    if (key === 'createdAt') return new Date(value);
                    return value;
                });
            } catch (e) {
                console.error("Failed to parse history from local storage", e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('contentHistory', JSON.stringify(historyItems));
    }, [historyItems]);

    const addToHistory = (item: Omit<ContentItem, 'id' | 'createdAt'>) => {
        const newItem: ContentItem = {
            ...item,
            id: uuidv4(),
            createdAt: new Date(),
        };
        setHistoryItems((prev) => [newItem, ...prev]);
    };

    const deleteFromHistory = (id: string) => {
        setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearHistory = () => {
        setHistoryItems([]);
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
