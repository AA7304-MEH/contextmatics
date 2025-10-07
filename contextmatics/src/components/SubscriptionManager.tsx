import React from 'react'

const SubscriptionManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Subscription Management
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-blue-900">Pro Plan</h3>
                <p className="text-blue-700 mt-2">$29/month</p>
                <p className="text-sm text-blue-600 mt-1">Next billing: January 1, 2025</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Upgrade Plan
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Usage Statistics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">847</div>
                <div className="text-gray-600">Content repurposed this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1,000</div>
                <div className="text-gray-600">Monthly limit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">15%</div>
                <div className="text-gray-600">Usage percentage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager