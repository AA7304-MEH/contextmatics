import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { getEnvironmentInfo } from '@/utils/envCheck';
import { CountrySelector } from './CountrySelector';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

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
  const [selectedCountry, setSelectedCountry] = useState('US');
  const { updateUserCountry } = useAuth();

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
          {/* Country Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', textAlign: 'center' }}>
              Select Your Region <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <CountrySelector
              value={selectedCountry}
              onChange={(code) => {
                setSelectedCountry(code);
                updateUserCountry(code);
              }}
              className="max-w-xs mx-auto"
            />
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Important: Permanent Selection</p>
                  <p style={{ fontSize: '0.75rem', color: '#b45309', margin: 0 }}>
                    Your selected region will determine your pricing and available payment methods. This cannot be changed after account creation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!selectedCountry ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Select Your Region First</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Please select your region above to continue with authentication.</p>
            </div>
          ) : getEnvironmentInfo().isClerkKeyValid ? (
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
