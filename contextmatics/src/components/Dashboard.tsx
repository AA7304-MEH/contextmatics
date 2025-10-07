import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Credits Remaining</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{user.processingCredits}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Current Plan</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 capitalize">{user.plan}</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Account Status</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">Active</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-400">Welcome to your ContextMatic dashboard! Start creating content by visiting our main application.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;