"use client";

import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
    const { user, refreshProfile, logout } = useAuth();
    const { showToast } = useToast();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setUsername(user.username || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    username: username,
                })
                .eq('id', user.id);

            if (error) throw error;
            await refreshProfile();
            showToast('Profile updated successfully', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="mb-12 text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
                    <p className="text-lg text-[var(--color-text-secondary)]">Manage your profile and account preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="card p-6 border border-white/5 bg-black/20 text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                                {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                            </div>
                            <h3 className="text-white font-bold text-lg">{user.fullName || 'User'}</h3>
                            <p className="text-sm text-[var(--color-text-tertiary)] mb-6">{user.email}</p>
                            <button
                                onClick={logout}
                                className="w-full py-2 px-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="card p-6 border border-white/5 bg-black/20 mt-6 overflow-hidden">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-tertiary)] mb-4">Plan Details</h4>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white">Current Plan</span>
                                <span className="text-xs font-bold uppercase px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                                    {user.plan}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white">Credits</span>
                                <span className="text-sm font-mono font-bold text-green-400">{user.processingCredits} left</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="input w-full"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input w-full"
                                        placeholder="janedoe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Email (Cannot be changed)</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="input w-full opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn--primary h-12 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 border-none inline-flex items-center gap-2"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="card p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Security</h3>
                            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10 mb-6">
                                <p className="text-sm text-yellow-200/80 leading-relaxed">
                                    For security, password changes require email verification. Click below to receive a password reset link.
                                </p>
                            </div>
                            <button className="py-2 px-6 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
