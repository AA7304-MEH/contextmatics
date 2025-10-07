import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { razorpayService } from '../services/razorpayService'
import { paypalService } from '../services/paypalService'

const PricingPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal'>('razorpay')
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null)

  const handlePayment = async (planName: string, amount: number) => {
    setIsProcessingPayment(planName)

    try {
      // Get user details (in a real app, this would come from auth context)
      const userEmail = 'user@example.com' // Replace with actual user email
      const userName = 'ContextMatic User' // Replace with actual user name

      if (selectedPaymentMethod === 'razorpay') {
        await razorpayService.initiatePayment({
          amount,
          currency: 'USD',
          planName,
          userEmail,
          userName
        })
      } else {
        // Load PayPal SDK and initiate payment
        await paypalService.loadPayPalSDK()
        await paypalService.initiatePayment({
          amount,
          currency: 'USD',
          planName,
          userEmail,
          userName
        })
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      alert('Payment initiation failed. Please try again.')
    } finally {
      setIsProcessingPayment(null)
    }
  }

  const plans = [
    {
      name: 'Starter',
      price: 9,
      features: [
        '100 content repurposing per month',
        'Basic formats',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 29,
      features: [
        '1000 content repurposing per month',
        'All formats',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      features: [
        'Unlimited content repurposing',
        'All formats + custom',
        '24/7 phone support'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              ContextMatic
            </button>
            <div className="space-x-6">
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

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your content repurposing needs
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="razorpay"
                checked={selectedPaymentMethod === 'razorpay'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value as 'razorpay' | 'paypal')}
                className="mr-2 cursor-pointer"
              />
              <span className="cursor-pointer">Razorpay</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypal"
                checked={selectedPaymentMethod === 'paypal'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value as 'razorpay' | 'paypal')}
                className="mr-2 cursor-pointer"
              />
              <span className="cursor-pointer">PayPal</span>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-t-lg -mt-8 -mx-8 mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                ${plan.price}
                <span className="text-lg text-gray-500">/month</span>
              </p>

              <ul className="text-gray-600 mb-8 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan.name, plan.price)}
                disabled={isProcessingPayment === plan.name}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                    : 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400'
                } ${isProcessingPayment === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessingPayment === plan.name ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* PayPal Button Container (for PayPal payments) */}
        <div id="paypal-button-container" className="mt-8 text-center hidden"></div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose ContextMatic?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Process content in seconds with our advanced AI</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Join thousands of satisfied creators and marketers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage