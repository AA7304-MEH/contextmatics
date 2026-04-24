import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from './shared';
import { CountrySelector } from './CountrySelector';
import { SEO } from './shared/SEO';

const Settings: React.FC = () => {
  const router = useRouter();
  const { user, updateUserCountry } = useAuth();
  const [showSaveNotification, setShowSaveNotification] = useState(false);

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

  const handleSave = () => {
    if (profileData.country) {
      updateUserCountry(profileData.country);
    }
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8 md:p-12 border border-white/10 bg-background-surface/50">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="mb-4 text-white text-2xl font-bold">Please Log In</h2>
          <p className="text-text-secondary mb-8">You need to be logged in to access settings.</p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary w-full justify-center"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout showPricing={true} showSettings={false}>
      <SEO title="Settings" description="Manage your ContextMatic account preferences and security." />
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16 text-center animate-fade-in opacity-0 stagger-1">
            <h1 className="text-3xl md:text-4xl mb-4 tracking-tight font-bold text-white">
              Account Settings
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Manage your profile, preferences, and security settings with ease.
            </p>
          </div>

          {/* Save Notification */}
          {showSaveNotification && (
            <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
              <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg">Success</p>
                  <p className="text-sm opacity-90">Your changes have been saved.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in opacity-0 stagger-2">

            {/* Profile Card */}
            <div className="card p-8 border border-white/10 bg-background-surface/50">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg text-white">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">My Profile</h2>
                  <p className="text-text-secondary text-sm">Personal info & details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input w-full bg-black/40 border-white/10 text-white rounded-lg p-3 focus:border-brand-primary/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="input w-full bg-black/40 border-white/10 text-white/60 rounded-lg p-3 cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md">VERIFIED</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="input w-full bg-black/40 border-white/10 text-white rounded-lg p-3 focus:border-brand-primary/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Country</label>
                  <CountrySelector
                    value={profileData.country}
                    onChange={(country) => setProfileData({ ...profileData, country })}
                    className="input w-full bg-black/40 border-white/10 text-white rounded-lg p-3 focus:border-brand-primary/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Timezone</label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    className="input w-full bg-black/40 border-white/10 text-white rounded-lg p-3 focus:border-brand-primary/50 outline-none h-[52px]"
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
                  className="btn btn-primary w-full mt-4 justify-center"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Subscription Card */}
              <div className="card p-8 border border-white/10 bg-background-surface/50">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-3xl shadow-lg text-white">
                    💳
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-white">Subscription</h2>
                    <p className="text-text-secondary text-sm">Plan & Billing details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Current Plan</p>
                      <p className="text-lg font-bold text-white capitalize">{user.plan} Plan</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Credits</p>
                      <p className="text-lg font-bold text-white">{user.processingCredits} <span className="text-sm font-normal text-text-muted">remaining</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/subscription')}
                    className="btn btn-secondary w-full justify-center mt-2 group"
                  >
                    Manage Subscription
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Notifications Card */}
              <div className="card p-8 border border-white/10 bg-background-surface/50">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg text-white">
                    🔔
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-white">Notifications</h2>
                    <p className="text-text-secondary text-sm">Email & alerts setup</p>
                  </div>
                </div>

                <div className="space-y-4">
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
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{item.label}</p>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                      <div className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    className="btn btn-secondary w-full mt-4 justify-center"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Security Card */}
              <div className="card p-8 border border-white/10 bg-background-surface/50">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-3xl shadow-lg text-white">
                    🛡️
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-white">Security</h2>
                    <p className="text-text-secondary text-sm">Password & 2FA</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Password */}
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                        🔑
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">Password</h3>
                        <p className="text-xs text-text-secondary">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary w-full text-xs justify-center">
                      Update Password
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
                        ⚠️
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-red-500 mb-1">Danger Zone</h3>
                        <p className="text-xs text-red-400">Permanently delete your account</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 rounded-full border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                      Delete Account
                    </button>
                  </div>
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
