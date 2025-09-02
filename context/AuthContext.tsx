
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { User, PlanId } from '../types';
import { checkAbuseAndCreateUser } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, countryCode: string, visitorId: string) => Promise<void>;
    logout: () => void;
    upgradePlan: (plan: 'pro' | 'business' | 'enterprise') => void;
    decrementCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing session
        const storedUser = localStorage.getItem('contextmatic_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    const updateUser = useCallback((newUser: User | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('contextmatic_user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('contextmatic_user');
        }
    }, []);

    const login = async (email: string, countryCode: string, visitorId: string) => {
        setLoading(true);
        // The abuse check will determine if they get a 'free' or 'free_abuse' plan.
        const newUser = await checkAbuseAndCreateUser(email, countryCode, visitorId);

        // If it's a legitimate new user on the free plan, set a flag to show them the pricing page once.
        if (newUser.plan === 'free') {
            sessionStorage.setItem('contextmatic_new_user', 'true');
        } else {
            // Clear flag for returning users or abuse cases.
            sessionStorage.removeItem('contextmatic_new_user');
        }

        updateUser(newUser);
        setLoading(false);
    };

    const logout = () => {
        updateUser(null);
        // also clear our mock abuse database for demonstration purposes
        localStorage.removeItem('fingerprint_db');
        localStorage.removeItem('contextmatic_jobs'); // also clear jobs
        sessionStorage.removeItem('contextmatic_new_user');
    };

    const upgradePlan = (plan: 'pro' | 'business' | 'enterprise') => {
        if (user) {
            let credits = 0;
            if (plan === 'pro') credits = 10;
            else if (plan === 'business') credits = 50;
            else if (plan === 'enterprise') credits = 500; // Assign a high number for demo purposes

            updateUser({
                ...user,
                plan: plan,
                processingCredits: credits,
            });
        }
    };
    
    const decrementCredits = () => {
        if (user && user.processingCredits > 0) {
            updateUser({
                ...user,
                processingCredits: user.processingCredits - 1,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, upgradePlan, decrementCredits }}>
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