import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-8">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl border border-gray-100">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-xl text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
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
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg bg-transparent border-none cursor-pointer"
              >
                Settings
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

      {/* Main Content */}
      <div className="pt-40 pb-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Welcome Back! 👋
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              You're logged in as <span className="font-semibold text-indigo-600">{user.email}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Credits Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Credits Remaining</h3>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {user.processingCredits}
                  </p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">💎</div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">Use credits to generate content</p>
              </div>
            </div>

            {/* Plan Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Current Plan</h3>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent capitalize">
                    {user.plan}
                  </p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">🚀</div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Upgrade Plan →
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Account Status</h3>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Active
                  </p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform">✨</div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/pricing')}
                className="group bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 p-8 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">View Pricing</h3>
                <p className="text-gray-600 text-sm">Explore our plans and pricing</p>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 p-8 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600 text-sm">Manage your account preferences</p>
              </button>

              <button
                onClick={() => navigate('/history')}
                className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 p-8 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📜</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">History</h3>
                <p className="text-gray-600 text-sm">View your content history</p>
              </button>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl text-white text-center">
            <h2 className="text-4xl font-extrabold mb-4">Ready to Create Amazing Content?</h2>
            <p className="text-xl mb-8 opacity-90">Transform your ideas into engaging content with AI</p>
            <button
              onClick={() => navigate('/content-creator')}
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
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
