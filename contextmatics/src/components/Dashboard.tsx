import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from './shared';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <PageLayout showPricing={true} showSettings={true}>
      <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1rem, 2vw, 2rem)', marginBottom: '4rem' }}>
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

              {/* Video Editor Card */}
              <div
                onClick={() => navigate('/video-editor')}
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
                  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  🎬
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Video Editor</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Manually edit, trim, and enhance your videos.
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

              {/* Manage Subscription Card */}
              <div
                onClick={() => navigate('/subscription')}
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
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  💳
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Manage Subscription</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Upgrade your plan, view invoices, and manage billing.
                </p>
              </div>

              {/* Social Scheduler Card */}
              <div
                onClick={() => {
                  if (user.plan === 'free') {
                    if (confirm('This feature is available on Pro and Business plans. Would you like to upgrade?')) {
                      navigate('/pricing');
                    }
                  } else {
                    alert('Social Scheduler coming soon!');
                  }
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'clamp(16px, 3vw, 24px)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '200px',
                  opacity: user.plan === 'free' ? 0.9 : 1
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
                {user.plan === 'free' && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <span>🔒</span> Pro
                  </div>
                )}
                <div style={{
                  width: 'clamp(50px, 10vw, 60px)',
                  height: 'clamp(50px, 10vw, 60px)',
                  borderRadius: 'clamp(12px, 2.5vw, 16px)',
                  background: user.plan === 'free'
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                  color: 'white',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}>
                  📅
                </div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Social Scheduler</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                  Schedule and manage your social media posts.
                </p>
              </div>

              {/* Trend Hunter Card */}
              <div
                onClick={() => {
                  if (user.plan === 'free') {
                    if (confirm('This feature is available on Pro and Business plans. Would you like to upgrade?')) {
                      navigate('/pricing');
                    }
                  } else {
                    alert('Trend Hunter coming soon!');
                  }
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'clamp(16px, 3vw, 24px)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '200px',
                  opacity: user.plan === 'free' ? 0.9 : 1
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
                {user.plan === 'free' && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#4b5563',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <span>🔒</span> Pro
                  </div>
                )}
                <div style={{
                  width: 'clamp(50px, 10vw, 60px)',
                  height: 'clamp(50px, 10vw, 60px)',
                  borderRadius: 'clamp(12px, 2.5vw, 16px)',
                  background: user.plan === 'free'
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                  color: 'white',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}>
                  📈
                </div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Trend Hunter</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                  Discover viral topics and trending hashtags.
                </p>
              </div>

              {/* Account Settings Card */}
              <div
                onClick={() => navigate('/settings')}
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
                  background: 'linear-gradient(135deg, #6b7280, #1f2937)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  ⚙️
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Account Settings</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Update your profile, security, and notification preferences.
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
    </PageLayout>
  );
};

export default Dashboard;
