import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User, PlanId } from '../types';
import { checkAbuseAndCreateUser } from '../services/api';

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
    signup: (email: string, countryCode: string, visitorId: string) => Promise<void>;
    logout: () => void;
    upgradePlan: (plan: 'pro' | 'business' | 'enterprise') => void;
    decrementCredits: () => void;
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

    const signup = async (email: string, countryCode: string, visitorId: string) => {
        const newUser = await checkAbuseAndCreateUser(email, countryCode, visitorId);
        saveUserToStorage(newUser);
        setUser(newUser);
    };

    const logout = () => {
        saveUserToStorage(null);
        setUser(null);
    };

    const upgradePlan = (plan: 'pro' | 'business' | 'enterprise') => {
        if (user) {
            let credits = 0;
            if (plan === 'pro') credits = 10;
            else if (plan === 'business') credits = 50;
            else if (plan === 'enterprise') credits = 500;

            const updatedUser = { ...user, plan: plan, processingCredits: credits };
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

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            signup,
            logout,
            upgradePlan,
            decrementCredits
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