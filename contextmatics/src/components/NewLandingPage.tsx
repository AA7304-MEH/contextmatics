import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

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
                onClick={() => {
                  console.log('Login button clicked'); // Debug log
                  setIsLogin(true);
                  setShowAuthModal(true);
                }}
                style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  console.log('Get Started button clicked'); // Debug log
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
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

    </div>
  )
}

export default NewLandingPage
