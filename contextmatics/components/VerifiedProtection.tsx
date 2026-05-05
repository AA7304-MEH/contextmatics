"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageLayout } from './shared';

/**
 * VerifiedProtection: Enforces email verification for sensitive routes.
 * Weaponized for Phase 10 Identity Security.
 */
export const VerifiedProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isVerified, loading, logout } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary text-white">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        if (typeof window !== 'undefined') window.location.href = '/sign-in';
        return null;
    }

    if (!isVerified && process.env.NODE_ENV === 'production') {
        return (
            <PageLayout showPricing={false} showSettings={false}>
                <div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-8 border border-amber-500/20">
                        <span className="text-5xl text-amber-500">📧</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Verify Your Identity</h1>
                    <p className="text-xl text-text-secondary max-w-lg mb-12">
                        To access ContextMatic's AI suite, please confirm your email address at <span className="text-blue-400 font-bold">{user.email}</span>.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => window.location.reload()}
                            className="btn btn-primary px-8"
                        >
                            I've Verified My Email
                        </button>
                        <button 
                            onClick={logout}
                            className="btn btn-secondary px-8"
                        >
                            Sign Out
                        </button>
                    </div>
                    <p className="mt-8 text-sm text-text-muted">
                        Check your inbox (and spam folder) for the verification link.
                    </p>
                </div>
            </PageLayout>
        );
    }

    return <>{children}</>;
};
