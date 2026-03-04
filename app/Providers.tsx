"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { VideoProvider } from '@/context/VideoContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <HistoryProvider>
                        <VideoProvider>
                            {children}
                        </VideoProvider>
                    </HistoryProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
