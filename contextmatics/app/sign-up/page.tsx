"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function SignupContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, isAuthenticated } = useAuth();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(email, 'US', '', { password, fullName });
            showToast('Account created!', 'success');
            // Use window.location.href for a clean state transition with middleware
            window.location.href = returnTo;
        } catch (error: any) {
            showToast(error.message || 'Failed to sign up', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
                <div className="card p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input w-full"
                                placeholder="Jane Doe"
                            />
                        </div>
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
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}
