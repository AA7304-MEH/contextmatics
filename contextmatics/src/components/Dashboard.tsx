import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '3rem', textAlign: 'center', maxWidth: '28rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: '3.75rem', marginBottom: '1.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>Please Log In</h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>You need to be logged in to access the dashboard.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', position: 'relative' }}>
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
            <button
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>ContextMatics</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <button
                onClick={() => navigate('/pricing')}
                style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/settings')}
                style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                Settings
              </button>
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'white',
                  color: '#dc2626',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: '2px solid #fecaca',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '10rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.75rem', fontWeight: '800', color: '#111827', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
              Welcome Back! 👋
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', lineHeight: '1.625' }}>
              You're logged in as <span style={{ fontWeight: '600', color: '#4f46e5' }}>{user.email}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {/* Credits Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f3f4f6', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Credits Remaining</h3>
                  <p style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #4f46e5, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {user.processingCredits}
                  </p>
                </div>
                <div style={{ fontSize: '3.75rem' }}>💎</div>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Use credits to generate content</p>
              </div>
            </div>

            {/* Plan Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f3f4f6', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Current Plan</h3>
                  <p style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'capitalize' }}>
                    {user.plan}
                  </p>
                </div>
                <div style={{ fontSize: '3.75rem' }}>🚀</div>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => navigate('/pricing')}
                  style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Upgrade Plan →
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f3f4f6', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Account Status</h3>
                  <p style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Active
                  </p>
                </div>
                <div style={{ fontSize: '3.75rem' }}>✨</div>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>All systems operational</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '2rem' }}>Quick Actions</h2>
            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              {/* Create Content Card */}
              <div
                onClick={() => navigate('/content-creator')}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  ✨
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Create Content</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Generate blog posts, threads, and newsletters instantly with AI.
                </p>
              </div>

              {/* Video Repurposing Card */}
              <div
                onClick={() => navigate('/video-repurpose')}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  🎥
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Video to Shorts</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Turn long videos into viral shorts and reels automatically.
                </p>
              </div>

              {/* View History Card */}
              <div
                onClick={() => navigate('/history')}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  📚
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>View History</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Access all your generated content and past projects.
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div style={{
            background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Create Amazing Content?</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>Transform your ideas into engaging content with AI</p>
            <button
              onClick={() => navigate('/content-creator')}
              style={{
                backgroundColor: 'white',
                color: '#4f46e5',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
            >
              Start Creating →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
