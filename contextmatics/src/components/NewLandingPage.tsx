import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (isLogin) {
        // Login flow
        await login(authEmail, authPassword)
      } else {
        // Signup flow
        await signup(authEmail, 'US', 'visitor_123', { name: authName || authEmail.split('@')[0] })
      }
      setShowAuthModal(false)
      navigate('/dashboard')
    } catch (err) {
      setAuthError('Authentication failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    setAuthError('')
    setAuthLoading(true)

    try {
      await login(`user@${provider}.com`, 'social_auth_token')
      setShowAuthModal(false)
      navigate('/dashboard')
    } catch (err) {
      setAuthError(`${provider} authentication failed.`)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827' }}>
      {/* Gradient Orbs Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
      </div>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.3s',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#2563eb',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>C</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>ContextMatics</span>
            </div>
            
            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="#product" style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Product</a>
              <a href="#features" style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Pricing</a>
              <a href="#resources" style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Resources</a>
              <button 
                onClick={() => { setIsLogin(true); setShowAuthModal(true); }}
                style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setShowAuthModal(true); }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '7rem', paddingBottom: '4rem', padding: '7rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          {/* Main Headline */}
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            <span style={{ color: '#1f2937' }}>From scratch to beautiful</span>
            <br />
            <span style={{ color: '#6b7280' }}>Content Creation</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
            ContextMatics is the AI-powered content builder that lets creators and marketers ship and iterate faster, and build content that just keeps getting better.
          </p>

          {/* Email CTA */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', maxWidth: '28rem', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Get a demo
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '14px' }}>
            Used by inspiring companies to build
          </p>
          <p style={{ color: '#111827', fontWeight: '600', marginBottom: '3rem', fontSize: '16px' }}>
            inspiring content
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', opacity: 0.4 }}>
            {['TechCorp', 'StartupX', 'MediaCo', 'AgencyPro'].map((company, index) => (
              <div key={index} style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6b7280' }}>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Everything you need to create
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Powerful AI features to help you build and scale your content
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { title: 'Lightning Fast', description: 'Generate content in seconds with our advanced AI engine' },
              { title: 'Multi-Format Output', description: 'Transform into blogs, tweets, emails, and more instantly' },
              { title: 'SEO Optimized', description: 'Built-in optimization for better search rankings' },
              { title: 'Mobile Responsive', description: 'Perfect on every device, from mobile to desktop' },
              { title: 'Team Collaboration', description: 'Work together seamlessly with your entire team' },
              { title: 'Analytics Dashboard', description: 'Track performance and optimize your content strategy' }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ fontSize: '24px' }}>⚡</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#111827' }}>{feature.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2.5rem' }}>
            Join thousands of creators building beautiful content with AI
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: 'white',
                color: '#111827',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1.125rem',
                border: '2px solid #d1d5db',
                cursor: 'pointer'
              }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '4rem 1.5rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', marginBottom: '3rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2563eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>ContextMatics</span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '28rem' }}>
                AI-powered content transformation for modern creators
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="#features" style={{ color: '#6b7280', textDecoration: 'none' }}>Features</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#pricing" style={{ color: '#6b7280', textDecoration: 'none' }}>Pricing</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>API</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Blog</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            © 2024 ContextMatics. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div 
          onClick={() => setShowAuthModal(false)}
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
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
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
                borderRadius: '8px'
              }}
            >
              ×
            </button>

            <div style={{ padding: '2.5rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p style={{ fontSize: '1rem', color: '#6b7280' }}>
                  {isLogin ? 'Sign in to continue' : 'Start creating amazing content'}
                </p>
              </div>

              {/* Social Auth Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => handleSocialAuth('google')}
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#111827',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    opacity: authLoading ? 0.6 : 1
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialAuth('github')}
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#111827',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    opacity: authLoading ? 0.6 : 1
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  Continue with GitHub
                </button>

                <button
                  onClick={() => handleSocialAuth('microsoft')}
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#111827',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    opacity: authLoading ? 0.6 : 1
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: '#6b7280' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required={!isLogin}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>

                {authError && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.875rem' }}>
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: authLoading ? '#93c5fd' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    marginTop: '0.5rem'
                  }}
                >
                  {authLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setAuthError('');
                  }}
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

              {/* Terms */}
              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', lineHeight: '1.5' }}>
                By continuing, you agree to our{' '}
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewLandingPage
