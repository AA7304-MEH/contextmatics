"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('return_to') || '/dashboard';

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated) {
            router.replace(returnTo);
        }
    }, [isAuthenticated, router, returnTo]);

    const handleOAuth = async (provider: 'google' | 'github' | 'azure') => {
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        await supabase.auth.signInWithOAuth({ 
            provider: provider, 
            options: { redirectTo: `${window.location.origin}/auth/callback` } 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            showToast('Welcome back!', 'success');

            // Force a full page reload to ensure middleware and session sync
            window.location.href = returnTo;
        } catch (error: any) {
            showToast(error.message || 'Failed to sign in', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign in to ContextMatic</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        Or{' '}
                        <Link href="/sign-up" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            start your free trial
                        </Link>
                    </p>
                </div>
                <div className="card p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn--primary w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 border-none"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-black/40 text-[var(--color-text-tertiary)] backdrop-blur-xl">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button type="button" onClick={() => handleOAuth('google')} className="btn py-2 border border-white/10 hover:bg-white/5 text-white font-medium rounded-lg text-sm transition-colors">Google</button>
                            <button type="button" onClick={() => handleOAuth('github')} className="btn py-2 border border-white/10 hover:bg-white/5 text-white font-medium rounded-lg text-sm transition-colors">GitHub</button>
                            <button type="button" onClick={() => handleOAuth('azure')} className="btn py-2 border border-white/10 hover:bg-white/5 text-white font-medium rounded-lg text-sm transition-colors">Microsoft</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
