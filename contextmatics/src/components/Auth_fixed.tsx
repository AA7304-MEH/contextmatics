import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp, useSignUp } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { getEnvironmentInfo } from '@/utils/envCheck';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [useEmailSignup] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-radial from-indigo-500/15 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-radial from-purple-500/15 to-transparent blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 bg-transparent border-none cursor-pointer"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ContextMatics</span>
            </button>
            
            <div className="flex items-center space-x-10">
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Content */}
      <div className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {isLogin ? 'Sign in to continue your journey' : 'Create your account and start transforming content'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative">
              {envInfo.isClerkKeyValid ? (
                isLogin ? (
                  <SignIn routing="hash" signUpUrl="#/signup" afterSignInUrl="#/dashboard" />
                ) : (
                  useEmailSignup ? (
                    <EmailSignUp onDone={() => navigate('/dashboard')} />
                  ) : (
                    <SignUp routing="hash" signInUrl="#/login" afterSignUpUrl="#/dashboard" />
                  )
                )
              ) : (
                <div className="p-6 border border-blue-200 rounded-2xl bg-blue-50 text-center">
                  <div className="text-5xl mb-4">🔧</div>
                  <p className="text-blue-700 font-medium mb-2">Development Mode</p>
                  <p className="text-blue-600 text-sm mb-4">Authentication is in development mode. You can test the app without signing up.</p>
                  <button
                    onClick={() => {
                      const mockUser = {
                        id: 'dev_user_' + Date.now(),
                        email: 'dev@contextmatic.example.com',
                        countryCode: 'IN',
                        plan: 'free',
                        processingCredits: 10,
                      };
                      localStorage.setItem('devMockUser', JSON.stringify(mockUser));
                      window.location.reload(); // Force reload to trigger AuthContext
                    }}
                    className="w-full py-3 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    Continue as Guest Developer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Link */}
          {envInfo.isClerkKeyValid && (
            <div className="mt-8 text-center text-lg text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors bg-transparent border-none cursor-pointer underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          )}

          {/* Trust Indicators */}
          {envInfo.isClerkKeyValid && (
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Email Signup Only</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Free Trial Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

const EmailSignUp: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'enter' | 'verify'>('enter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStage('verify');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Unable to start sign up');
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: res.createdSessionId });
      onDone();
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {stage === 'enter' ? (
        <form onSubmit={submitEnter} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-base font-bold transition-all ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:scale-105'
            } text-white`}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitVerify} className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">📧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-gray-600">We've sent a verification code to {email}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-center text-2xl font-mono tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-base font-bold transition-all ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:scale-105'
            } text-white`}
          >
            {loading ? 'Verifying…' : 'Verify & Continue'}
          </button>
        </form>
      )}
    </div>
  );
};