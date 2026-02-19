import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

import type { User, PlanId, SubscriptionInfo, Profile } from '../types';
import { subscriptionService } from '../services/subscriptionService';
import { isAdminEmail } from '../config/admin';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, countryCode: string, visitorId: string, userData?: any) => Promise<void>;
    logout: () => void;
    upgradePlan: (plan: PlanId) => void;
    decrementCredits: () => void;
    renewSubscription: () => void;
    cancelSubscription: (cancelAtPeriodEnd?: boolean) => void;
    checkSubscriptionStatus: () => void;
    updateUserCountry: (countryCode: string) => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderWithClerk: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerkAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper function to detect user location
    const detectUserLocation = async (): Promise<string> => {
        try {
            // First check for manually selected country
            const storedCountry = localStorage.getItem('user_country_preference')
            if (storedCountry) return storedCountry

            // First try to get location from browser timezone and language
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
            const lang = navigator.language || ''

            if (tz === 'Asia/Kolkata' || lang.toLowerCase().includes('-in')) {
                return 'IN'
            }

            // If timezone detection fails, try to detect from IP (you can integrate a geolocation service here)
            // For now, we'll use a simple heuristic based on timezone

            // Common Indian timezones
            const indianTimezones = [
                'Asia/Kolkata',
                'Asia/Calcutta',
                'Asia/Kolkata'
            ]

            if (indianTimezones.includes(tz)) {
                return 'IN'
            }

            // Check for other common countries (you can expand this)
            if (tz.startsWith('Europe/')) return 'EU'
            if (tz.startsWith('Asia/')) {
                if (tz.includes('Tokyo') || tz.includes('Seoul')) return 'JP'
                if (tz.includes('Shanghai') || tz.includes('Hong_Kong')) return 'CN'
                return 'AS' // Other Asian countries default to Asia
            }

            return 'US' // Default fallback
        } catch (error) {
            console.warn('Location detection failed, defaulting to US:', error)
            return 'US'
        }
    }

    useEffect(() => {
        if (isLoaded) {
            if (clerkUser) {
                // Detect user location and create mapped user
                const createUser = async () => {
                    const detectedCountryCode = await detectUserLocation()

                    const isAdmin = isAdminEmail(clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress);

                    const mappedUser: User = {
                        id: clerkUser.id,
                        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || '',
                        countryCode: detectedCountryCode,
                        plan: isAdmin ? 'enterprise' : 'free',
                        processingCredits: isAdmin ? 999999 : 3,
                        role: isAdmin ? 'admin' : 'user',
                    };
                    setUser(mappedUser);
                }

                createUser()
            } else {
                // Helper to check for dev mock user
                const mockUserStr = localStorage.getItem('devMockUser');
                if (mockUserStr) {
                    try {
                        const mockUser = JSON.parse(mockUserStr);
                        // Ensure role is up to date with email
                        const isAdmin = isAdminEmail(mockUser.email);
                        const role = isAdmin ? 'admin' : 'user';
                        const plan = isAdmin ? 'enterprise' : mockUser.plan;
                        const processingCredits = isAdmin ? 999999 : mockUser.processingCredits;

                        setUser({ ...mockUser, role, plan, processingCredits });
                    } catch (e) {
                        console.error('Failed to parse mock user', e);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        }
    }, [clerkUser, isLoaded]);

    const login = async (_email: string, _password: string) => {
        throw new Error('Use Clerk SignIn component for authentication');
    };

    const signup = async (_email: string, _countryCode: string, _visitorId: string, _userData?: any) => {
        throw new Error('Use Clerk SignUp component for authentication');
    };

    const logout = async () => {
        localStorage.removeItem('devMockUser');
        await signOut();
    };

    const upgradePlan = (plan: PlanId) => {
        if (user) {
            let credits = 0;
            if (plan === 'pro') credits = 10;
            else if (plan === 'business') credits = 50;
            else if (plan === 'enterprise') credits = 500;
            let subscription: SubscriptionInfo | undefined;
            if (plan !== 'free' && plan !== 'free_abuse') {
                subscription = subscriptionService.createSubscription(user.id, plan);
            }
            const updatedUser = {
                ...user,
                plan: plan,
                processingCredits: credits,
                subscription
            };
            setUser(updatedUser);
        }
    };

    const decrementCredits = () => {
        if (user && user.processingCredits > 0) {
            const updatedUser = { ...user, processingCredits: user.processingCredits - 1 };
            setUser(updatedUser);
        }
    };

    const renewSubscription = () => {
        if (user && user.subscription) {
            const renewedSubscription = subscriptionService.renewSubscription(user.subscription);
            const updatedUser = { ...user, subscription: renewedSubscription };
            setUser(updatedUser);
        }
    };

    const cancelSubscription = (cancelAtPeriodEnd: boolean = true) => {
        if (user && user.subscription) {
            const cancelledSubscription = subscriptionService.cancelSubscription(user.subscription, cancelAtPeriodEnd);
            const updatedUser = { ...user, subscription: cancelledSubscription };
            setUser(updatedUser);
        }
    };

    const checkSubscriptionStatusHandler = () => {
        if (user && user.subscription) {
            const updatedSubscription = subscriptionService.checkAndUpdateSubscriptionStatus(user.subscription);
            if (updatedSubscription !== user.subscription) {
                const updatedUser = { ...user, subscription: updatedSubscription };
                setUser(updatedUser);
            }
        }
    };

    const updateUserCountry = (countryCode: string) => {
        // Always save preference to localStorage so it persists through sign-up/login
        localStorage.setItem('user_country_preference', countryCode);

        if (user) {
            const updatedUser = { ...user, countryCode };
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            signup,
            logout,
            upgradePlan,
            decrementCredits,
            renewSubscription,
            cancelSubscription,
            checkSubscriptionStatus: checkSubscriptionStatusHandler,
            updateUserCountry,
            refreshProfile: async () => { } // Clerk handles its own sync usually, or we can improve this later
        }}>
            {children}
        </AuthContext.Provider>
    );
};

const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from 'profiles' table
    const fetchProfile = async (userId: string, _email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Error fetching profile:', error);
                return null;
            }
            return data as Profile;
        } catch (e) {
            console.error('Exception fetching profile:', e);
            return null;
        }
    };

    const mapSessionToUser = async (sessionUser: any): Promise<User> => {
        const profile = await fetchProfile(sessionUser.id, sessionUser.email!);

        // Fallback or Admin logic
        const isAdmin = isAdminEmail(sessionUser.email);

        return {
            id: sessionUser.id,
            email: sessionUser.email!,
            countryCode: profile?.countryCode || 'US', // Add country_code to profile schema if needed, defaulting US
            plan: (profile?.plan as PlanId) || (isAdmin ? 'enterprise' : 'free'),
            processingCredits: profile?.credits_remaining ?? (isAdmin ? 999999 : 3),
            role: isAdmin ? 'admin' : 'user',
            username: profile?.username,
            fullName: profile?.full_name,
            avatarUrl: profile?.avatar_url
        };
    };

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            // Check for mock session first
            const mockSession = localStorage.getItem('auth_session');
            if (mockSession) {
                try {
                    setUser(JSON.parse(mockSession));
                    setLoading(false);
                    return;
                } catch (e) { console.error(e); }
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const mappedUser = await mapSessionToUser(session.user);
                setUser(mappedUser);
            }
            setLoading(false);
        };

        initSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const mappedUser = await mapSessionToUser(session.user);
                setUser(mappedUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        // --- MOCK AUTH BYPASS ---
        // If we are in dev/demo mode or using specific test accounts, bypass Supabase
        const isMockUser = email === 'admin@com.com' || email.includes('dev@example.com') || email.includes('guest');
        const isSupabaseConfigured = !(supabase as any).supabaseUrl?.includes('placeholder');

        if (isMockUser || !isSupabaseConfigured) {
            console.debug('[Demo] Using Mock Authentication for:', email);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const isAdmin = isAdminEmail(email);
            const mockUser: User = {
                id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
                email: email,
                countryCode: 'US', // Default
                plan: isAdmin ? 'enterprise' : 'free',
                processingCredits: isAdmin ? 999999 : 3,
                role: isAdmin ? 'admin' : 'user',
                username: email.split('@')[0],
                fullName: 'Mock User (' + (isAdmin ? 'Admin' : 'Guest') + ')',
                avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=random`
            };

            setUser(mockUser);
            // Persist simple session
            localStorage.setItem('auth_session', JSON.stringify(mockUser));
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signup = async (email: string, countryCode: string, _visitorId: string, userData?: any) => {
        // --- MOCK AUTH BYPASS ---
        const isMockUser = email.includes('dev') || email.includes('guest') || !(supabase as any).supabaseUrl?.includes('placeholder');
        if (isMockUser) { // Simplified check for dev environment
            console.debug('[Demo] Using Mock Signup for:', email);
            await new Promise(resolve => setTimeout(resolve, 800));

            const isAdmin = isAdminEmail(email);
            const mockUser: User = {
                id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
                email: email,
                countryCode: countryCode || 'US',
                plan: isAdmin ? 'enterprise' : 'free',
                processingCredits: 10,
                role: isAdmin ? 'admin' : 'user',
                username: email.split('@')[0],
                fullName: userData?.fullName || email.split('@')[0],
                avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=random`
            };

            setUser(mockUser);
            localStorage.setItem('auth_session', JSON.stringify(mockUser));
            return;
        }

        const password = userData?.password || 'TemporaryPass123!';

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: userData?.fullName || email.split('@')[0],
                    country_code: countryCode
                }
            }
        });

        if (error) throw error;

        // Manually insert profile if trigger doesn't exist yet (Client-side Sync)
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                username: email.split('@')[0],
                full_name: userData?.fullName,
                plan: 'free',
                credits_remaining: 10
            });
            if (profileError) console.warn('Profile creation failed', profileError);
        }
    };

    const logout = async () => {
        localStorage.removeItem('auth_session');
        localStorage.removeItem('devMockUser');
        await supabase.auth.signOut();
        setUser(null);
    };

    const upgradePlan = async (plan: PlanId) => {
        if (user) {
            // Simplified update for prototype
            const { error } = await supabase.from('profiles').update({ plan }).eq('id', user.id);
            if (!error) {
                setUser({ ...user, plan });
            }
        }
    };

    const decrementCredits = async () => {
        if (user && user.processingCredits > 0) {
            const newCredits = user.processingCredits - 1;
            const { error } = await supabase.from('profiles').update({ credits_remaining: newCredits }).eq('id', user.id);
            if (!error) {
                setUser({ ...user, processingCredits: newCredits });
            }
        }
    };

    // Stubs
    const renewSubscription = () => { };
    const cancelSubscription = () => { };
    const checkSubscriptionStatus = () => { };
    const updateUserCountry = (countryCode: string) => {
        // Optionally save to profile
        if (user) {
            setUser({ ...user, countryCode });
        }
    };

    const refreshProfile = async () => {
        if (user) {
            const mappedUser = await mapSessionToUser({ id: user.id, email: user.email });
            setUser(mappedUser);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
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
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Determine which provider to use based on Clerk availability
    const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    // Force Local Provider on localhost to ensure Admin Bypass works
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Only enable Clerk if key exists AND we are NOT on localhost (or if we explicitly want to test Clerk on localhost, we'd need a different flag)
    // For now, strict disable on localhost to fix user issue.
    const isClerkEnabled = !!clerkKey && !clerkKey.includes('#') && !isLocalhost;

    if (isClerkEnabled) {
        return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>;
    } else {
        return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
    }
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};