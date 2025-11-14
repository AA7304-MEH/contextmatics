import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: user?.email || '',
    company: 'Acme Inc.',
    timezone: 'UTC-5'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    contentGenerated: true,
    weeklyReport: false,
    productUpdates: true,
    billingAlerts: true
  });

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '28rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Please Log In</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You need to be logged in to access settings.</p>
          <button
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
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
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
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
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/pricing')}
                style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Pricing
              </button>
              <button
                onClick={logout}
                style={{ backgroundColor: 'white', color: '#dc2626', fontSize: '14px', fontWeight: '500', border: '1px solid #fecaca', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: '7rem', paddingBottom: '3rem', padding: '7rem 1.5rem 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Settings</h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Manage your account preferences and settings</p>
          </div>

          {/* Save Notification */}
          {showSaveNotification && (
            <div style={{
              position: 'fixed',
              top: '7rem',
              right: '1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              zIndex: 50
            }}>
              ✓ Settings saved successfully!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {/* Sidebar Tabs */}
            <div>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1rem' }}>
                <button
                  onClick={() => setActiveTab('profile')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: activeTab === 'profile' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'profile' ? '#1d4ed8' : '#374151',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    <span>Profile</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: activeTab === 'notifications' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'notifications' ? '#1d4ed8' : '#374151',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔔</span>
                    <span>Notifications</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: activeTab === 'security' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'security' ? '#1d4ed8' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔒</span>
                    <span>Security</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1 }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Profile Information</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Company</label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Timezone</label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            backgroundColor: 'white'
                          }}
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
                        style={{
                          width: '100%',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '1rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)'
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Notification Preferences</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'contentGenerated', label: 'Content Generated', desc: 'Get notified when content is ready' },
                        { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly usage summary' },
                        { key: 'productUpdates', label: 'Product Updates', desc: 'Stay informed about new features' },
                        { key: 'billingAlerts', label: 'Billing Alerts', desc: 'Important billing notifications' }
                      ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '600', color: '#111827', fontSize: '1rem' }}>{item.label}</p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                            })}
                            style={{
                              position: 'relative',
                              display: 'inline-flex',
                              height: '24px',
                              width: '44px',
                              alignItems: 'center',
                              borderRadius: '9999px',
                              backgroundColor: notificationSettings[item.key as keyof typeof notificationSettings] ? '#2563eb' : '#d1d5db',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                height: '16px',
                                width: '16px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                transform: notificationSettings[item.key as keyof typeof notificationSettings] ? 'translateX(20px)' : 'translateX(2px)',
                                transition: 'transform 0.2s'
                              }}
                            />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleSave}
                        style={{
                          width: '100%',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '1rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
                          marginTop: '1rem'
                        }}
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Security Settings</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Change Password</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>Update your password to keep your account secure</p>
                        <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                          Change Password
                        </button>
                      </div>

                      <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Two-Factor Authentication</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>Add an extra layer of security to your account</p>
                        <button style={{ backgroundColor: '#10b981', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                          Enable 2FA
                        </button>
                      </div>

                      <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '2px solid #fecaca' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Danger Zone</h3>
                        <p style={{ fontSize: '0.875rem', color: '#dc2626', marginBottom: '1rem' }}>Permanently delete your account and all data</p>
                        <button style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
