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

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isClerkKeyValid } = getEnvironmentInfo();
  if (!isClerkKeyValid) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <>{/* fallback */}<a href="#/auth">Login</a></>;
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
