import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { getEnvironmentInfo } from '@/utils/envCheck';
import { CountrySelector } from './CountrySelector';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updateUserCountry, signup, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const path = window.location.hash.replace('#', '');
    if (path === '/signup') setIsLogin(false);
    else if (path === '/login') setIsLogin(true);
  }, []);

  const envInfo = getEnvironmentInfo();



  return (
    <div className="min-h-screen bg-background-primary font-sans flex items-center justify-center relative overflow-hidden text-text-primary">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center animate-fade-in">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-[10px] font-bold text-white shadow-lg">C</div>
          <span className="font-medium text-sm tracking-tight text-text-primary group-hover:text-white transition-colors">ContextMatic</span>
        </button>
      </nav>

      {/* Auth Content Glass Panel */}
      <div className="w-full max-w-md relative z-10 px-4 animate-fade-in animation-delay-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-text-secondary text-sm">
            {isLogin ? 'Enter your credentials to access the workspace.' : 'Start building with context-aware AI.'}
          </p>
        </div>

        {/* Glass Card */}
        <div className="card p-8 bg-background-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Region</label>
            <CountrySelector
              value={selectedCountry}
              onChange={(code) => {
                setSelectedCountry(code);
                updateUserCountry(code);
              }}
              className="input w-full text-sm py-2 px-3 bg-background-primary border-white/10"
            />
          </div>

          {!selectedCountry ? (
            <div className="text-center py-6">
              <p className="text-text-secondary text-sm">Please select your region above.</p>
            </div>
          ) : (envInfo.isClerkKeyValid && !window.location.hash.includes('admin=true')) ? (
            isLogin ? (
              <SignIn routing="hash" signUpUrl="#/signup" afterSignInUrl="#/dashboard" appearance={{
                variables: {
                  colorPrimary: '#3B82F6',
                  colorBackground: 'transparent',
                  colorText: '#f9f9f9',
                  colorInputBackground: '#0a0a0a',
                  colorInputText: '#f9f9f9',
                  colorTextSecondary: '#a0a0a0'
                },
                elements: {
                  card: 'shadow-none bg-transparent p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formButtonPrimary: 'btn btn-primary w-full text-sm normal-case justify-center',
                  formFieldInput: 'input text-sm border-white/10 focus:border-brand-primary',
                  formFieldLabel: 'text-text-secondary text-xs',
                  footerActionLink: 'text-brand-primary hover:text-brand-primaryHover'
                }
              }} />
            ) : (
              <SignUp routing="hash" signInUrl="#/login" afterSignUpUrl="#/dashboard" appearance={{
                variables: {
                  colorPrimary: '#3B82F6',
                  colorBackground: 'transparent',
                  colorText: '#f9f9f9',
                  colorInputBackground: '#0a0a0a',
                  colorInputText: '#f9f9f9',
                  colorTextSecondary: '#a0a0a0'
                },
                elements: {
                  card: 'shadow-none bg-transparent p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formButtonPrimary: 'btn btn-primary w-full text-sm normal-case justify-center',
                  formFieldInput: 'input text-sm border-white/10 focus:border-brand-primary',
                  formFieldLabel: 'text-text-secondary text-xs',
                  footerActionLink: 'text-brand-primary hover:text-brand-primaryHover'
                }
              }} />
            )
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="input w-full p-3 bg-black/40 border-white/10 rounded-lg focus:border-brand-primary"
                id="email-input"
              />
              <input
                type="password"
                placeholder="Password"
                className="input w-full p-3 bg-black/40 border-white/10 rounded-lg focus:border-brand-primary"
                id="password-input"
              />

              <button
                onClick={async () => {
                  const email = (document.getElementById('email-input') as HTMLInputElement).value;
                  const password = (document.getElementById('password-input') as HTMLInputElement).value;

                  if (!email || !password) {
                    return;
                  }

                  setLoading(true);
                  try {
                    if (isLogin) {
                      await login(email, password);
                    } else {
                      await signup(email, selectedCountry, '', { password });
                    }
                  } catch (e: any) {
                    console.error('Auth failed:', e);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="btn btn-primary w-full justify-center"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background-surface px-2 text-text-secondary">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 8.16-3.293 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z" /></svg>
                  Google
                </button>
                <button className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </button>
              </div>

              {/* Dev Mode Guest Login - Removed as per strict user request */}
              {/*
              {envInfo.isDevelopmentMode && (
                <button ... />
              )}
            */}
            </div>
          )}
        </div>

        {/* Toggle */}
        <div className="mt-8 text-center animate-fade-in animation-delay-200">
          <button onClick={() => setIsLogin(!isLogin)} className="text-text-secondary hover:text-white text-xs transition-colors">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

