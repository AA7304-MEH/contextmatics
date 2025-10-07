import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User, PlanId, SubscriptionInfo } from '../types';
import { subscriptionService } from '../services/subscriptionService';

const getUserFromStorage = (): User | null => {
    try {
        const userStr = localStorage.getItem('contextmatic_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return null;
    }
};

const saveUserToStorage = (user: User | null) => {
    try {
        if (user) {
            localStorage.setItem('contextmatic_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('contextmatic_user');
        }
    } catch (e) {
        console.error("Failed to save user to localStorage", e);
    }
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    signup: (email: string, countryCode: string, visitorId: string, userData?: any) => Promise<void>;
    logout: () => void;
    upgradePlan: (plan: PlanId) => void;
    decrementCredits: () => void;
    renewSubscription: () => void;
    cancelSubscription: (cancelAtPeriodEnd?: boolean) => void;
    checkSubscriptionStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getUserFromStorage();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const signup = async (email: string, countryCode: string, visitorId: string, userData?: any) => {
        // Mock user creation for demo
        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            countryCode,
            plan: 'free',
            processingCredits: 3,
        };

        saveUserToStorage(newUser);
        setUser(newUser);
    };

    const logout = () => {
        saveUserToStorage(null);
        setUser(null);
    };

    const upgradePlan = (plan: PlanId) => {
        if (user) {
            let credits = 0;
            if (plan === 'pro') credits = 10;
            else if (plan === 'business') credits = 50;
            else if (plan === 'enterprise') credits = 500;

            // Create subscription for paid plans
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
            saveUserToStorage(updatedUser);
            setUser(updatedUser);
        }
    };

    const decrementCredits = () => {
        if (user && user.processingCredits > 0) {
            const updatedUser = { ...user, processingCredits: user.processingCredits - 1 };
            saveUserToStorage(updatedUser);
            setUser(updatedUser);
        }
    };

    const renewSubscription = () => {
        if (user && user.subscription) {
            const renewedSubscription = subscriptionService.renewSubscription(user.subscription);
            const updatedUser = { ...user, subscription: renewedSubscription };
            saveUserToStorage(updatedUser);
            setUser(updatedUser);
        }
    };

    const cancelSubscription = (cancelAtPeriodEnd: boolean = true) => {
        if (user && user.subscription) {
            const cancelledSubscription = subscriptionService.cancelSubscription(user.subscription, cancelAtPeriodEnd);
            const updatedUser = { ...user, subscription: cancelledSubscription };
            saveUserToStorage(updatedUser);
            setUser(updatedUser);
        }
    };

    const checkSubscriptionStatusHandler = () => {
        if (user && user.subscription) {
            const updatedSubscription = subscriptionService.checkAndUpdateSubscriptionStatus(user.subscription);
            if (updatedSubscription !== user.subscription) {
                const updatedUser = { ...user, subscription: updatedSubscription };
                saveUserToStorage(updatedUser);
                setUser(updatedUser);
            }
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};