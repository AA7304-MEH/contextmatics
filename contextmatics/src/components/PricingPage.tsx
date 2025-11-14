import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PricingPage: React.FC = () => {
  const navigate = useNavigate()
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
                    onClick={() => navigate('/dashboard')}
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
                    Get Started
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
