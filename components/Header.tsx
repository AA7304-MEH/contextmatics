
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const getPlanName = () => {
        if (!user) return '';
        switch (user.plan) {
            case 'free': return 'Hobbyist';
            case 'pro': return 'Pro';
            case 'business': return 'Business';
            case 'enterprise': return 'Enterprise';
            case 'free_abuse': return 'Action Required';
            default: return '';
        }
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                         <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ContextMatic</h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                             <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                                <div className="flex items-center justify-end space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="px-2 py-0.5 rounded-full text-white text-xs font-semibold bg-indigo-500">{getPlanName()}</span>
                                    {user.plan !== 'free_abuse' && <span>Credits: <span className="font-bold text-slate-700 dark:text-slate-200">{user.processingCredits}</span></span>}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;