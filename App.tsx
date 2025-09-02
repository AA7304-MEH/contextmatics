import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import Header from './components/Header';
import ToastContainer from './components/ui/ToastContainer';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [showPricingAfterSignup, setShowPricingAfterSignup] = useState(false);

    useEffect(() => {
        // Check sessionStorage flag to determine if we should show the pricing page to a new user.
        if (user?.plan === 'free' && sessionStorage.getItem('contextmatic_new_user') === 'true') {
            setShowPricingAfterSignup(true);
        } else if (showPricingAfterSignup) {
            // Reset if user state changes or flag is removed, to avoid being stuck.
            setShowPricingAfterSignup(false);
        }
    }, [user]);

    const handleContinueToDashboard = () => {
        sessionStorage.removeItem('contextmatic_new_user');
        setShowPricingAfterSignup(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <LandingPage />;
    }

    // For brand new users, show the pricing page to encourage selecting a plan.
    if (showPricingAfterSignup) {
         return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
                <Header />
                <PricingPage showContinueButton={true} onContinue={handleContinueToDashboard} />
            </div>
        );
    }
    
    if (user.plan === 'free_abuse') {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
                <Header />
                <PricingPage />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Header />
            <main>
                <Dashboard />
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                 <AppContent />
                 <ToastContainer />
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
