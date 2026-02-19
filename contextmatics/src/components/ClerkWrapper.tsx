import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { getEnvironmentInfo } from '@/utils/envCheck';

const clerkPubKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) as string | undefined;

interface ClerkWrapperProps {
  children: React.ReactNode;
}

export const ClerkWrapper: React.FC<ClerkWrapperProps> = ({ children }) => {
  const { isClerkKeyValid } = getEnvironmentInfo();
  if (!isClerkKeyValid) {
    return <>{children}</>;
  }
  return (
    <ClerkProvider publishableKey={clerkPubKey as string}>
      {children}
    </ClerkProvider>
  );
};

// Hook to get Clerk user data
export const useClerkUser = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || user.firstName || '',
      imageUrl: user.imageUrl,
    } : null,
    isLoaded,
    isSignedIn,
  };
};

// Mock Auth Guard — separate component so hooks aren't called conditionally
const MockAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      gap: '24px',
    }}>
      <div style={{
        width: '48px', height: '48px',
        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', fontWeight: 'bold', color: '#fff',
      }}>C</div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Sign in to continue</h2>
      <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>You need to be logged in to access this page.</p>
      <a
        href="#/auth"
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          color: '#fff',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px',
          transition: 'all 0.2s',
        }}
      >
        Sign In →
      </a>
    </div>
  );
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isClerkKeyValid } = getEnvironmentInfo();

  if (!isClerkKeyValid) {
    return <MockAuthGuard>{children}</MockAuthGuard>;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
