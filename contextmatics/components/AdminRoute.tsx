import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEnvironmentInfo } from '@/utils/envCheck';

interface AdminRouteProps {
    children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const { isClerkKeyValid } = getEnvironmentInfo();

    // If Clerk is not set up, we rely on local mock logic which should be consistent
    if (!isClerkKeyValid && !isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
