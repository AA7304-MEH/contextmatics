import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { razorpayService } from '@/services/razorpayService'
import { paypalService } from '@/services/paypalService'

const PricingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showPaypalModal, setShowPaypalModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number } | null>(null)

  const isIndia = useMemo(() => {
    // Automatic location detection
    if (user?.countryCode === 'IN') return true
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      const lang = navigator.language || ''
      return tz === 'Asia/Kolkata' || lang.toLowerCase().includes('-in')
    } catch {
      return false
    }
  }, [user])
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        '100 content generations/month',
        'All output formats',
        'Basic templates',
        'Email support',
        '1 user'
      ],
      popular: false
    },
    {
      name: 'Pro',
      description: 'For growing teams',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        '1,000 content generations/month',
        'All output formats',
        'Premium templates',
        'Priority support',
        'Up to 5 users',
        'Team collaboration',
        'Advanced analytics'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Unlimited content generations',
        'All output formats',
        'Custom templates',
        '24/7 phone support',
        'Unlimited users',
        'Advanced team features',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ]

  // Check for payment configuration
  const [configError, setConfigError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isIndia) {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey.includes('dummy')) {
        setConfigError('Razorpay is not configured. Payments will not work.');
      }
    } else {
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!paypalClientId || paypalClientId.includes('dummy')) {
        setConfigError('PayPal is not configured. Payments will not work.');
      }
    }
  }, [isIndia]);

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
                onClick={() => navigate('/')}
                style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Pricing Header */}
        <section style={{ paddingTop: '7rem', paddingBottom: '3rem', padding: '7rem 1.5rem 3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '48rem', margin: '0 auto 3rem' }}>
            Choose the perfect plan for your content creation needs
          </p>

          {configError && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 2rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span style={{ fontWeight: '600' }}>{configError}</span>
            </div>
          )}

          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '0.25rem' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: billingCycle === 'monthly' ? 'white' : 'transparent',
                color: billingCycle === 'monthly' ? '#111827' : '#6b7280',
                boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: billingCycle === 'yearly' ? 'white' : 'transparent',
                color: billingCycle === 'yearly' ? '#111827' : '#6b7280',
                boxShadow: billingCycle === 'yearly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Yearly
              <span style={{ fontSize: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                Save 20%
              </span>
            </button>
          </div>
        </section>

        {/* Payment Method Indicator */}
        <section style={{ padding: '2rem 1.5rem 0', textAlign: 'center' }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            backgroundColor: isIndia ? '#fff7ed' : '#eff6ff',
            borderRadius: '12px',
            border: `1px solid ${isIndia ? '#fed7aa' : '#bfdbfe'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {isIndia ? (
                <svg style={{ width: '20px', height: '20px', color: '#ea580c' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M5 3H15V9H5V3M19 21H5V16H19V21Z" />
                </svg>
              ) : (
                <svg style={{ width: '20px', height: '20px', color: '#2563eb' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.93 12.24C9.47 12.24 9.09 12.41 8.8 12.74C8.51 13.06 8.36 13.49 8.36 13.95V14.5H7.27V15.5H8.61V17.5H9.7V15.5H10.82V14.5H9.7V13.92C9.7 13.47 9.89 13.09 10.26 12.78C10.64 12.47 11.14 12.31 11.77 12.31C12.4 12.31 12.9 12.47 13.27 12.78C13.64 13.09 13.83 13.47 13.83 13.92V14.5H14.92V15.5H13.58V17.5H14.67V18.5H7.27V17.5H8.36V15.5H7.27V14.5H8.36V13.95C8.36 13.03 8.7 12.24 9.93 12.24Z" />
                </svg>
              )}
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: isIndia ? '#c2410c' : '#1d4ed8' }}>
                {isIndia ? '🇮🇳 Recommended for India' : '🌍 Recommended for International Users'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: isIndia ? '#9a3412' : '#1e40af', margin: 0 }}>
              {isIndia
                ? 'You\'ll be able to pay using Razorpay with UPI, cards, or net banking'
                : 'You\'ll be able to pay using PayPal or credit/debit cards'
              }
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{ padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {plans.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: plan.popular ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    padding: '2rem',
                    boxShadow: plan.popular ? '0 10px 25px rgba(37, 99, 235, 0.1)' : 'none'
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0.375rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      ⭐ Most Popular
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{plan.name}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{plan.description}</p>

                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span style={{ color: '#6b7280' }}>
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '0.5rem' }}>
                        Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice}/year
                      </p>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
                      const currency = isIndia ? 'INR' : 'USD'
                      const email = user?.email || 'guest@contextmatic.example.com'
                      const name = user?.id ? 'ContextMatic User' : 'Guest User'

                      if (isIndia) {
                        try {
                          await razorpayService.initiatePayment({
                            amount,
                            currency,
                            planName: plan.name,
                            userEmail: email,
                            userName: name
                          })
                        } catch (e: any) {
                          console.error('Razorpay error:', e)
                          alert(e?.message || 'Unable to start Razorpay checkout. Please check your configuration and try again.')
                        }
                      } else {
                        try {
                          setSelectedPlan({ name: plan.name, amount })
                          setShowPaypalModal(true)
                          await paypalService.loadPayPalSDK(currency)
                          // Small delay to ensure modal is rendered
                          setTimeout(async () => {
                            try {
                              await paypalService.initiatePayment({
                                amount,
                                currency,
                                planName: plan.name,
                                userEmail: email,
                                userName: name
                              })
                            } catch (e: any) {
                              console.error('PayPal initiation error:', e)
                              setShowPaypalModal(false)
                              alert(e?.message || 'Unable to initialize PayPal checkout. Please try again.')
                            }
                          }, 100)
                        } catch (e: any) {
                          console.error('PayPal SDK loading error:', e)
                          setShowPaypalModal(false)
                          alert(e?.message || 'Unable to load PayPal SDK. Please check your configuration and try again.')
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      marginBottom: '2rem',
                      backgroundColor: plan.popular ? '#2563eb' : 'white',
                      color: plan.popular ? 'white' : '#111827',
                      border: plan.popular ? 'none' : '1px solid #d1d5db'
                    }}
                  >
                    {isIndia ? 'Buy with Razorpay' : 'Buy with PayPal'}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <svg style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span style={{ color: '#111827' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: '4rem 1.5rem', backgroundColor: '#f9fafb' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem', color: '#111827' }}>
              Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  q: 'Can I change plans anytime?',
                  a: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
                },
                {
                  q: 'What happens if I exceed my limit?',
                  a: 'You can purchase additional credits or upgrade to a higher plan. We\'ll notify you before any charges.'
                }
              ].map((faq, index) => (
                <div key={index} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{faq.q}</h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2.5rem' }}>
              Join thousands of creators transforming their content with AI
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            >
              Start Free Trial →
            </button>
          </div>
        </section>

        {/* PayPal Modal */}
        {showPaypalModal && (
          <div onClick={() => setShowPaypalModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', margin: '1rem' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{selectedPlan ? `${selectedPlan.name} Plan - $${selectedPlan.amount}` : 'Checkout'}</h3>
                <button onClick={() => setShowPaypalModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#6b7280', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Complete your payment with PayPal</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>You'll be redirected to the dashboard after successful payment</p>
              </div>
              <div id="paypal-button-container" style={{ minHeight: '150px' }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #e5e7eb', padding: '3rem 1.5rem', backgroundColor: '#f9fafb' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            © 2024 ContextMatics. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default PricingPage
