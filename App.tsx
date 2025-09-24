import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import Header from './components/Header';
import ToastContainer from './components/ui/ToastContainer';

const AppContent: React.FC = () => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (!isAuthenticated || !user) {
        return <LandingPage />;
    }

    // If the user has been flagged for abuse, show them the pricing page.
    if (user.plan === 'free_abuse') {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
                <Header />
                <PricingPage />
            </div>
        );
    }
    
    // Render the main dashboard for a fully authenticated and onboarded user.
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