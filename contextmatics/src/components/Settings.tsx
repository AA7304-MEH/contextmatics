import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-8">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl border border-gray-100">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-xl text-gray-600 mb-8">You need to be logged in to access settings.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={logout}
                className="bg-white text-red-600 text-base font-semibold border-2 border-red-200 px-6 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">Settings</h1>
            <p className="text-xl text-gray-600 leading-relaxed">Manage your account preferences and settings</p>
          </div>

          {/* Save Notification */}
          {showSaveNotification && (
            <div className="fixed top-32 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-slide-in">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Settings saved successfully!</span>
            </div>
          )}

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 sticky top-32">
                {[
                  { id: 'profile', icon: '👤', label: 'Profile' },
                  { id: 'notifications', icon: '🔔', label: 'Notifications' },
                  { id: 'security', icon: '🔒', label: 'Security' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-semibold border-none cursor-pointer mb-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tab.icon}</span>
                      <span className="text-lg">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile Information</h2>
                    <div className="flex flex-col gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Company</label>
                        <input
                          type="text"
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Timezone</label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
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
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg border-none cursor-pointer hover:shadow-xl hover:scale-105 transition-all mt-4"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Notification Preferences</h2>
                    <div className="flex flex-col gap-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'contentGenerated', label: 'Content Generated', desc: 'Get notified when content is ready' },
                        { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly usage summary' },
                        { key: 'productUpdates', label: 'Product Updates', desc: 'Stay informed about new features' },
                        { key: 'billingAlerts', label: 'Billing Alerts', desc: 'Important billing notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-lg">{item.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                            })}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full border-none cursor-pointer transition-all ${
                              notificationSettings[item.key as keyof typeof notificationSettings]
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 rounded-full bg-white shadow-lg transition-transform ${
                                notificationSettings[item.key as keyof typeof notificationSettings]
                                  ? 'translate-x-9'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg border-none cursor-pointer hover:shadow-xl hover:scale-105 transition-all mt-4"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Security Settings</h2>
                    <div className="flex flex-col gap-6">
                      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-indigo-100">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl">🔑</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2 text-xl">Change Password</h3>
                            <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold border-none cursor-pointer hover:shadow-lg transition-all">
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl">🛡️</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2 text-xl">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold border-none cursor-pointer hover:shadow-lg transition-all">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl">⚠️</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-red-700 mb-2 text-xl">Danger Zone</h3>
                            <p className="text-sm text-red-600 mb-4">Permanently delete your account and all data. This action cannot be undone.</p>
                            <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold border-none cursor-pointer hover:shadow-lg transition-all">
                              Delete Account
                            </button>
                          </div>
                        </div>
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
