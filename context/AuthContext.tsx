"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User, PlanId, Profile } from '@/types';
import { subscriptionService } from '@/services/subscriptionService';
import { isAdminEmail } from '@/config/admin';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isVerified: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, countryCode: string, viewerId: string, userData?: any) => Promise<void>;
    logout: () => void;
    upgradePlan: (plan: PlanId) => void;
    decrementCredits: () => void;
    renewSubscription: () => void;
    cancelSubscription: (cancelAtPeriodEnd?: boolean) => void;
    checkSubscriptionStatus: () => void;
    updateUserCountry: (countryCode: string) => void;
    updateProfile: (data: { username?: string, fullName?: string, avatarUrl?: string }) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from 'profiles' table
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('[Auth] No profile found for user yet (expected for new signups)');
                } else {
                    console.warn('Error fetching profile:', error.message);
                }
                return null;
            }
            return data as Profile;
        } catch (e) {
            console.error('Exception fetching profile:', e);
            return null;
        }
    };

    const mapSessionToUser = async (sessionUser: any): Promise<User> => {
        const isAdmin = isAdminEmail(sessionUser.email);

        // Return a basic user object immediately
        const baseUser: User = {
            id: sessionUser.id,
            email: sessionUser.email!,
            countryCode: 'US',
            plan: isAdmin ? 'enterprise' : 'free',
            processingCredits: isAdmin ? 999999 : 5,
            role: isAdmin ? 'admin' : 'user',
        };

        // Attempt to fetch profile in background
        try {
            const profile = await fetchProfile(sessionUser.id);
            if (profile) {
                return {
                    ...baseUser,
                    countryCode: profile.country_code || baseUser.countryCode,
                    plan: (profile.plan as PlanId) || baseUser.plan,
                    processingCredits: profile.credits_remaining ?? baseUser.processingCredits,
                    username: profile.username,
                    fullName: profile.full_name,
                    avatarUrl: profile.avatar_url
                };
            }
        } catch (e) {
            console.warn('[Auth] Profile fetch failed:', e);
        }

        return baseUser;
    };

    useEffect(() => {
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const isAdmin = isAdminEmail(session.user.email);
                setIsVerified(!!session.user.email_confirmed_at);
                
                const baseUser: User = {
                    id: session.user.id,
                    email: session.user.email!,
                    countryCode: 'US',
                    plan: isAdmin ? 'enterprise' : 'free',
                    processingCredits: isAdmin ? 999999 : 5,
                    role: isAdmin ? 'admin' : 'user',
                };
                setUser(baseUser);
                setLoading(false);

                const mappedUser = await mapSessionToUser(session.user);
                setUser(mappedUser);
            } else {
                setLoading(false);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const isAdmin = isAdminEmail(session.user.email);
                setIsVerified(!!session.user.email_confirmed_at);

                const baseUser: User = {
                    id: session.user.id,
                    email: session.user.email!,
                    countryCode: 'US',
                    plan: isAdmin ? 'enterprise' : 'free',
                    processingCredits: isAdmin ? 999999 : 5,
                    role: isAdmin ? 'admin' : 'user',
                };
                setUser(baseUser);

                const mappedUser = await mapSessionToUser(session.user);
                setUser(mappedUser);
            } else {
                setUser(null);
                setIsVerified(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-redirect if authenticated and on sign-in page
    useEffect(() => {
        if (!loading && user && typeof window !== 'undefined' &&
            (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up')) {
            console.log('[Auth] Authenticated user on auth page, redirecting to dashboard...');
            window.location.href = '/dashboard';
        }
    }, [user, loading]);

    const login = async (email: string, password: string) => {
        console.log('[Auth] Attempting login for:', email);

        // Add a 15-second timeout to prevent infinite hang
        const loginPromise = supabase.auth.signInWithPassword({ email, password });
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Login timed out. Check your connection.')), 15000)
        );

        const { error } = await Promise.race([loginPromise, timeoutPromise]) as any;
        if (error) {
            console.error('[Auth] Login error:', error);
            throw error;
        }
        console.log('[Auth] Login request sent successfully');
    };

    const signup = async (email: string, countryCode: string, _viewerId: string, userData?: any) => {
        const password = userData?.password || 'TemporaryPass123!';

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: userData?.fullName || email.split('@')[0],
                    country_code: countryCode,
                    plan: 'free',
                    credits_remaining: 5
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            console.log('[Auth] Account created, profile will be initialized by DB trigger');
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const upgradePlan = async (plan: PlanId) => {
        // Weaponized Phase 10: sensitive updates MUST go through backend/payments
        console.warn('[Auth] upgradePlan called from client. This should be handled via /api/payments/verify.');
        if (user && process.env.NODE_ENV !== 'production') {
            const { error } = await supabase.from('profiles').update({ plan }).eq('id', user.id);
            if (!error) {
                setUser({ ...user, plan });
            }
        }
    };

    const decrementCredits = async () => {
        if (user && user.processingCredits > 0) {
            const newCredits = user.processingCredits - 1;
            // Best practice: Use a DB function to decrement credits to prevent race conditions
            const { error } = await supabase.rpc('decrement_user_credits');
            
            if (error) {
                // Fallback for dev if RPC not yet applied
                const { error: fallbackError } = await supabase.from('profiles').update({ credits_remaining: newCredits }).eq('id', user.id);
                if (!fallbackError) setUser({ ...user, processingCredits: newCredits });
            } else {
                setUser({ ...user, processingCredits: newCredits });
            }
        }
    };

    const renewSubscription = () => {
        if (user && user.subscription) {
            const renewedSubscription = subscriptionService.renewSubscription(user.subscription);
            setUser({ ...user, subscription: renewedSubscription });
        }
    };

    const cancelSubscription = (cancelAtPeriodEnd: boolean = true) => {
        if (user && user.subscription) {
            const cancelledSubscription = subscriptionService.cancelSubscription(user.subscription, cancelAtPeriodEnd);
            setUser({ ...user, subscription: cancelledSubscription });
        }
    };

    const checkSubscriptionStatus = () => {
        if (user && user.subscription) {
            const updatedSubscription = subscriptionService.checkAndUpdateSubscriptionStatus(user.subscription);
            if (updatedSubscription !== user.subscription) {
                setUser({ ...user, subscription: updatedSubscription });
            }
        }
    };

    const updateUserCountry = async (countryCode: string) => {
        if (user) {
            const { error } = await supabase.from('profiles').update({ country_code: countryCode }).eq('id', user.id);
            if (!error) {
                setUser({ ...user, countryCode });
            }
        }
    };

    const updateProfile = async (data: { username?: string, fullName?: string, avatarUrl?: string }) => {
        if (!user) return;
        
        // Use the secure RPC for profile updates
        const { error } = await supabase.rpc('update_profile_safe', {
            new_username: data.username || user.username,
            new_full_name: data.fullName || user.fullName,
            new_avatar_url: data.avatarUrl || user.avatarUrl
        });

        if (error) {
            console.error('[Auth] Profile update error:', error);
            throw error;
        }

        await refreshProfile();
    };

    const refreshProfile = async () => {
        if (user) {
            const { data: { session } } = await supabase.auth.getSession();
            const mappedUser = await mapSessionToUser(session?.user || { id: user.id, email: user.email });
            setUser(mappedUser);
            if (session?.user) setIsVerified(!!session.user.email_confirmed_at);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isVerified,
            loading,
            login,
            signup,
            logout,
            upgradePlan,
            decrementCredits,
            renewSubscription,
            cancelSubscription,
            checkSubscriptionStatus,
            updateUserCountry,
            updateProfile,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};