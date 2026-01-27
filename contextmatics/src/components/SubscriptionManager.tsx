import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLayout } from './shared'

// Plan credit limits for usage calculation
const PLAN_CREDITS: Record<string, number> = {
  free: 3,
  pro: 10,
  business: 50,
  enterprise: 500
}

const PLAN_NAMES: Record<string, string> = {
  free: 'Free Plan',
  pro: 'Pro Plan',
  business: 'Business Plan',
  enterprise: 'Enterprise Plan'
}

const SubscriptionManager: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Calculate usage based on actual user data
  const planLimit = user ? PLAN_CREDITS[user.plan] || 3 : 3
  const creditsRemaining = user?.processingCredits || 0
  const creditsUsed = planLimit - creditsRemaining
  const usagePercent = planLimit > 0 ? ((creditsUsed / planLimit) * 100) : 0
  const remainingPercent = 100 - usagePercent

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#111827' }}>
          Subscription Management
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.125rem', marginBottom: '3rem' }}>
          Manage your plan and billing settings
        </p>

        {/* Current Plan Card */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>Current Plan</h2>
            <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
              <div style={{ backgroundColor: '#dbeafe', border: '2px solid #2563eb', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
                  {user ? PLAN_NAMES[user.plan] || 'Free Plan' : 'Free Plan'}
                </h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                  {planLimit}<span style={{ fontSize: '1.125rem', color: '#6b7280' }}> credits/month</span>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{creditsRemaining} credits remaining</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '48rem', margin: '2rem auto 0' }}>
              <button
                onClick={() => navigate('/pricing')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ⬆️ Upgrade Plan
              </button>
              <button
                onClick={() => alert('Cancellation is not allowed for the active term.')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af',
                  border: '1px solid #e5e7eb',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}
                disabled
              >
                ❌ Cancel Subscription
              </button>
              {/* Tooltip for disabled button */}
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', textAlign: 'center' }}>
                Cancellation is not allowed for the active term.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#111827' }}>Usage Statistics</h2>

          {/* Progress Bar */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: '#6b7280' }}>Monthly Usage</span>
              <span style={{ fontWeight: 'bold', color: '#111827' }}>{creditsUsed} / {planLimit}</span>
            </div>
            <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(usagePercent, 100)}%`,
                  backgroundColor: usagePercent > 80 ? '#ef4444' : '#2563eb',
                  borderRadius: '9999px',
                  transition: 'width 0.5s'
                }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>{remainingPercent.toFixed(1)}% remaining this billing cycle</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📝</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {creditsUsed}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>Credits Used</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>This month</div>
            </div>

            <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {planLimit}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>Monthly Limit</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{user ? PLAN_NAMES[user.plan] : 'Free Plan'}</div>
            </div>

            <div style={{ backgroundColor: creditsRemaining > 0 ? '#d1fae5' : '#fee2e2', border: `1px solid ${creditsRemaining > 0 ? '#6ee7b7' : '#fecaca'}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{creditsRemaining > 0 ? '✅' : '⚠️'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {creditsRemaining}
              </div>
              <div style={{ color: '#6b7280', fontWeight: '500' }}>Credits Remaining</div>
              <div style={{ fontSize: '0.875rem', color: creditsRemaining > 0 ? '#059669' : '#dc2626', marginTop: '0.25rem' }}>
                {creditsRemaining > 0 ? 'Ready to create!' : 'Upgrade needed'}
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>Billing History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid', invoice: '#INV-001' },
              { date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid', invoice: '#INV-002' },
              { date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid', invoice: '#INV-003' }
            ].map((bill, index) => (
              <div key={index} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#111827' }}>{bill.invoice}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{bill.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#111827' }}>{bill.amount}</p>
                    <p style={{ color: '#10b981', fontSize: '0.875rem' }}>{bill.status}</p>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    📄 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😢</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>Cancel Subscription?</h3>
              <p style={{ color: '#6b7280' }}>
                We're sad to see you go. Your subscription will remain active until the end of your billing period.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  alert('Subscription cancelled')
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#ef4444',
                  border: '1px solid #fecaca',
                  cursor: 'pointer'
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default SubscriptionManager
