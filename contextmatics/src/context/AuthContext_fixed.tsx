import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { getEnvironmentInfo } from '@/utils/envCheck';
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
            // Check for development mode mock user first
            const mockUserStr = localStorage.getItem('devMockUser');
            if (mockUserStr) {
                try {
                    const mockUser = JSON.parse(mockUserStr);
                    setUser(mockUser);
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error('Failed to parse mock user:', e);
                    localStorage.removeItem('devMockUser');
                }
            }

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
        // Clear mock user if in development mode
        if (localStorage.getItem('devMockUser')) {
            localStorage.removeItem('devMockUser');
            window.location.reload();
            return;
        }
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
            checkSubscriptionStatus: checkSubscriptionStatusHandler
        }}>
            {children}
        </AuthContext.Provider>
    );
};

const AuthProviderNoClerk: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading] = useState(false);

    // Check for development mode mock user
    useEffect(() => {
        const mockUserStr = localStorage.getItem('devMockUser');
        if (mockUserStr) {
            try {
                const mockUser = JSON.parse(mockUserStr);
                setUser(mockUser);
            } catch (e) {
                console.error('Failed to parse mock user:', e);
                localStorage.removeItem('devMockUser');
            }
        }
    }, []);

    const login = async (_email: string, _password: string) => { 
        // In development mode, you could implement mock authentication here
        console.log('Development mode: Authentication is disabled. Use mock user.');
    };
    
    const signup = async (_email: string, _countryCode: string, _visitorId: string, _userData?: any) => {
        console.log('Development mode: Signup is disabled. Use mock user.');
    };
    
    const logout = () => {
        localStorage.removeItem('devMockUser');
        setUser(null);
        window.location.reload();
    };
    
    const upgradePlan = (_plan: PlanId) => {
        if (user) {
            let credits = 0;
            if (_plan === 'pro') credits = 10;
            else if (_plan === 'business') credits = 50;
            else if (_plan === 'enterprise') credits = 500;
            const updatedUser = { ...user, plan: _plan, processingCredits: credits };
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
        // Development mode - no subscription service
        console.log('Development mode: Subscription renewal not implemented');
    };
    
    const cancelSubscription = (_cancelAtPeriodEnd: boolean = true) => {
        // Development mode - no subscription service
        console.log('Development mode: Subscription cancellation not implemented');
    };
    
    const checkSubscriptionStatusHandler = () => {
        // Development mode - no subscription service
        console.log('Development mode: Subscription status check not implemented');
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
            checkSubscriptionStatus: checkSubscriptionStatusHandler
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isClerkKeyValid } = getEnvironmentInfo();
    if (!isClerkKeyValid) {
        return <AuthProviderNoClerk>{children}</AuthProviderNoClerk>;
    }
    return <AuthProviderWithClerk>{children}</AuthProviderWithClerk>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};