"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CursorLandingPage } from "@/components/CursorLandingPage";

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) return (
        <div className="min-h-screen bg-background-primary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <main>
            <CursorLandingPage />
        </main>
    );
}
