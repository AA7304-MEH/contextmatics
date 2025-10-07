import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/pricing')
  }

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStartFreeTrial = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">
              ContextMatic
            </div>
            <div className="space-x-6">
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Subscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ContextMatic
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered content repurposing platform for creators and marketers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-semibold"
            >
              Get Started
            </button>
            <button
              onClick={handleLearnMore}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
            <p className="text-gray-600">
              Transform any content into multiple formats using advanced AI technology
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              Generate high-quality content in seconds, not hours
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
            <p className="text-gray-600">
              Multiple payment options with secure processing
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators who are already using ContextMatic
          </p>
          <div className="space-x-4">
            <button
              onClick={handleStartFreeTrial}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-semibold text-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer font-semibold text-lg"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage