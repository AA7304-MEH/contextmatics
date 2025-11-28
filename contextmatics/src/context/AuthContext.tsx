import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

import type { User, PlanId, SubscriptionInfo } from '../types';
import { subscriptionService } from '../services/subscriptionService';

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

                    const mappedUser: User = {
                        id: clerkUser.id,
                        email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || '',
                        countryCode: detectedCountryCode,
                        plan: 'free',
                        processingCredits: 3,
                    };
                    setUser(mappedUser);
                }

                createUser()
            } else {
                setUser(null);
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
            updateUserCountry
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};