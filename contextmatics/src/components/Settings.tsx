import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from './shared';
import { CountrySelector } from './CountrySelector';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserCountry } = useAuth();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: user?.email || '',
    company: 'Acme Inc.',
    timezone: 'UTC-5',
    country: user?.countryCode || 'US'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contentGenerated: true,
    weeklyReport: false,
    productUpdates: true,
    billingAlerts: true
  });

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    if (profileData.country) {
      updateUserCountry(profileData.country);
    }
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '3rem', textAlign: 'center', maxWidth: '28rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <div style={{ fontSize: '3.75rem', marginBottom: '1.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>Please Log In</h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>You need to be logged in to access settings.</p>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.125rem', border: 'none', cursor: 'pointer' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const gridCols = windowWidth < 768 ? '1fr' : windowWidth < 1200 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  const gridGap = windowWidth < 768 ? '1.5rem' : '2rem';

  return (
    <PageLayout showPricing={true} showSettings={false}>
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: windowWidth < 768 ? '2rem 1rem' : '4rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: windowWidth < 768 ? '2rem' : '4rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: windowWidth < 768 ? '2.5rem' : '3.75rem', fontWeight: '800', color: '#111827', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Account Settings
            </h1>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.25rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Manage your profile, preferences, and security settings with ease.
            </p>
          </div>

          {/* Save Notification */}
          {showSaveNotification && (
            <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 50 }}>
              <div style={{ background: '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>Success</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Your changes have been saved.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: gridGap
          }}>

            {/* Profile Card */}
            <div style={{ background: 'white', borderRadius: '24px', padding: windowWidth < 768 ? '1.5rem' : '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  👤
                </div>
                <div>
                  <h2 style={{ fontSize: windowWidth < 768 ? '1.5rem' : '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>My Profile</h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Personal info & details</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.875rem 1rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                    onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#4f46e5'; }}
                    onBlur={(e) => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#e5e7eb'; }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      style={{ width: '100%', padding: '0.875rem 1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', color: '#6b7280', cursor: 'not-allowed' }}
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: '600', color: '#10b981', background: '#d1fae5', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>VERIFIED</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    style={{ width: '100%', padding: '0.875rem 1rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                    onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#4f46e5'; }}
                    onBlur={(e) => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#e5e7eb'; }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Country</label>
                  <CountrySelector
                    value={profileData.country}
                    onChange={(country) => setProfileData({ ...profileData, country })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Timezone</label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    style={{ width: '100%', padding: '0.875rem 1rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '1rem', color: '#111827', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC+0">UTC</option>
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #4f46e5, #9333ea)', color: 'white', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '0.5rem', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notifications Card */}
            <div style={{ background: 'white', borderRadius: '24px', padding: windowWidth < 768 ? '1.5rem' : '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  🔔
                </div>
                <div>
                  <h2 style={{ fontSize: windowWidth < 768 ? '1.5rem' : '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>Notifications</h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Email & alerts setup</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive daily summaries via email' },
                  { key: 'contentGenerated', label: 'Content Generated', desc: 'Get notified when AI content is ready' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly usage reports' },
                  { key: 'productUpdates', label: 'Product Updates', desc: 'Be first to know about new features' },
                  { key: 'billingAlerts', label: 'Billing Alerts', desc: 'Get alerts about payments' }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                    })}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f9fafb', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '1rem', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{item.desc}</p>
                    </div>
                    <div style={{ position: 'relative', width: '52px', height: '28px', background: notificationSettings[item.key as keyof typeof notificationSettings] ? '#4f46e5' : '#d1d5db', borderRadius: '14px', transition: 'background 0.3s' }}>
                      <span style={{ position: 'absolute', top: '2px', left: notificationSettings[item.key as keyof typeof notificationSettings] ? '26px' : '2px', width: '24px', height: '24px', background: 'white', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSave}
                  style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '0.5rem', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Save Preferences
                </button>
              </div>
            </div>

            {/* Security Card */}
            <div style={{ background: 'white', borderRadius: '24px', padding: windowWidth < 768 ? '1.5rem' : '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  🛡️
                </div>
                <div>
                  <h2 style={{ fontSize: windowWidth < 768 ? '1.5rem' : '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>Security</h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Password & 2FA</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Password */}
                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      🔑
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>Password</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'white', color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#4f46e5'; }}
                  >
                    Update Password
                  </button>
                </div>

                {/* 2FA */}
                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      🔐
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem', margin: 0 }}>Two-Factor Authentication</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Add extra security layer</p>
                    </div>
                  </div>
                  <button style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'white', color: '#10b981', border: '2px solid #10b981', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#10b981'; }}
                  >
                    Enable 2FA
                  </button>
                </div>

                {/* Danger Zone */}
                <div style={{ padding: '1.5rem', background: '#fef2f2', borderRadius: '16px', border: '2px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      ⚠️
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem', margin: 0 }}>Danger Zone</h3>
                      <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: 0 }}>Permanently delete your account</p>
                    </div>
                  </div>
                  <button style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'white', color: '#dc2626', border: '2px solid #dc2626', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#dc2626'; }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
