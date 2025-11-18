import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { getEnvironmentInfo } from '@/utils/envCheck';

interface ClerkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  onToggleMode: () => void;
}

export const ClerkAuthModal: React.FC<ClerkAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  isLogin,
  onToggleMode 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(4px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 100,
        padding: '1rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          maxWidth: '480px', 
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          position: 'relative',
          padding: '2rem'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#6b7280',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            zIndex: 10
          }}
        >
          ×
        </button>

        <div style={{ marginTop: '1rem' }}>
          {getEnvironmentInfo().isClerkKeyValid ? (
            isLogin ? (
              <SignIn routing="hash" signUpUrl="#/signup" afterSignInUrl="/#/dashboard" />
            ) : (
              <SignUp routing="hash" signInUrl="#/login" afterSignUpUrl="/#/dashboard" />
            )
          ) : (
            <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280' }}>Authentication is not available. Please set a valid Clerk publishable key.</p>
            </div>
          )}
        </div>

        {/* Toggle Link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={onToggleMode}
            style={{
              color: '#2563eb',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
