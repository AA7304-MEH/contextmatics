import React, { useMemo, useState, useEffect } from 'react';
import { razorpayService } from '../services/razorpayService';
import { paypalService } from '../services/paypalService';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from './shared';

// Country‑specific pricing definitions
const countryPlans: Record<string, Array<{ name: string; description: string; monthlyPrice: number; yearlyPrice: number; popular?: boolean; features: string[] }>> = {
  IN: [
    { name: 'Free', description: 'Get started with essential features', monthlyPrice: 0, yearlyPrice: 0, features: ['5 credits/mo', 'Community support', 'Basic generation'] },
    { name: 'Basic', description: 'Essential features for individuals', monthlyPrice: 199, yearlyPrice: 2100, features: ['50 credits/mo', 'Email support', 'Standard generation'] },
    { name: 'Pro', description: 'Advanced tools for creators', monthlyPrice: 599, yearlyPrice: 6400, popular: true, features: ['200 credits/mo', 'Priority email support', 'Custom branding', 'HD video export'] },
    { name: 'Enterprise', description: 'All‑in‑one solution for teams', monthlyPrice: 1499, yearlyPrice: 16000, features: ['Unlimited credits', 'Dedicated account manager', 'Phone support', 'Team collaboration'] },
    { name: 'Ultimate', description: 'Premium package with exclusive perks', monthlyPrice: 2499, yearlyPrice: 27000, features: ['Unlimited credits', 'Dedicated manager', '24/7 support', 'Custom AI models', 'Early feature access'] }
  ],
  US: [
    { name: 'Basic', description: 'Essential features for individuals', monthlyPrice: 7, yearlyPrice: 75, features: ['10 credits/mo', 'Email support'] },
    { name: 'Pro', description: 'Advanced tools for creators', monthlyPrice: 20, yearlyPrice: 216, popular: true, features: ['100 credits/mo', 'Priority email support', 'Custom branding'] },
    { name: 'Enterprise', description: 'All‑in‑one solution for teams', monthlyPrice: 40, yearlyPrice: 432, features: ['Unlimited credits', 'Dedicated account manager', 'Phone support', 'Team collaboration'] },
    { name: 'Ultimate', description: 'Premium package with exclusive perks', monthlyPrice: 70, yearlyPrice: 756, features: ['Unlimited credits', 'Dedicated manager', '24/7 support', 'Custom AI models', 'Early feature access'] }
  ],
  GB: [
    { name: 'Basic', description: 'Essential features for individuals', monthlyPrice: 6, yearlyPrice: 66, features: ['10 credits/mo', 'Email support'] },
    { name: 'Pro', description: 'Advanced tools for creators', monthlyPrice: 18, yearlyPrice: 194, popular: true, features: ['100 credits/mo', 'Priority email support', 'Custom branding'] },
    { name: 'Enterprise', description: 'All‑in‑one solution for teams', monthlyPrice: 35, yearlyPrice: 378, features: ['Unlimited credits', 'Dedicated account manager', 'Phone support', 'Team collaboration'] },
    { name: 'Ultimate', description: 'Premium package with exclusive perks', monthlyPrice: 60, yearlyPrice: 648, features: ['Unlimited credits', 'Dedicated manager', '24/7 support', 'Custom AI models', 'Early feature access'] }
  ],
  DEFAULT: [
    { name: 'Basic', description: 'Essential features for individuals', monthlyPrice: 8, yearlyPrice: 84, features: ['10 credits/mo', 'Email support'] },
    { name: 'Pro', description: 'Advanced tools for creators', monthlyPrice: 22, yearlyPrice: 237, popular: true, features: ['100 credits/mo', 'Priority email support', 'Custom branding'] },
    { name: 'Enterprise', description: 'All‑in‑one solution for teams', monthlyPrice: 45, yearlyPrice: 486, features: ['Unlimited credits', 'Dedicated account manager', 'Phone support', 'Team collaboration'] },
    { name: 'Ultimate', description: 'Premium package with exclusive perks', monthlyPrice: 80, yearlyPrice: 864, features: ['Unlimited credits', 'Dedicated manager', '24/7 support', 'Custom AI models', 'Early feature access'] }
  ]
};

const PricingPage: React.FC = () => {

  const { user } = useAuth();
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number } | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [configError, setConfigError] = useState<string | null>(null);

  const isIndia = useMemo(() => {
    // 1. If user is logged in and has a country code, STRICTLY use that
    if (user?.countryCode) {
      return user.countryCode === 'IN';
    }

    // 2. Fallback for guest users: Detect from browser
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = navigator.language || '';
      return tz === 'Asia/Kolkata' || lang.toLowerCase().includes('-in');
    } catch {
      return false;
    }
  }, [user]);

  const userCountry = user?.countryCode || 'DEFAULT';
  const plans = countryPlans[userCountry] || countryPlans['DEFAULT'];

  const [isDemoMode, setIsDemoMode] = useState(false);

  // Validate payment SDK configuration
  useEffect(() => {
    if (isIndia) {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        setConfigError('Razorpay not configured');
      } else if (key.includes('dummy')) {
        setIsDemoMode(true);
        setConfigError(null);
      } else {
        setConfigError(null);
      }
    } else {
      const id = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!id) {
        setConfigError('PayPal not configured');
      } else if (id.includes('dummy')) {
        setIsDemoMode(true);
        setConfigError(null);
      } else {
        setConfigError(null);
      }
    }
  }, [isIndia]);

  // PayPal initialization
  const paypalInitialized = React.useRef(false);
  useEffect(() => {
    if (showPaypalModal && selectedPlan && !isIndia) {
      if (paypalInitialized.current) return;
      const init = async () => {
        try {
          paypalInitialized.current = true;
          const currency = 'USD';
          const email = user?.email || 'guest@contextmatic.example.com';
          const name = user?.id ? 'ContextMatic User' : 'Guest User';
          await paypalService.loadPayPalSDK(currency);
          await paypalService.initiatePayment({
            amount: selectedPlan.amount,
            currency,
            planName: selectedPlan.name,
            userEmail: email,
            userName: name
          });
        } catch (e) {
          console.error('PayPal init error', e);
          paypalInitialized.current = false;
        }
      };
      init();
    } else {
      paypalInitialized.current = false;
    }
  }, [showPaypalModal, selectedPlan, isIndia, user]);

  return (
    <PageLayout showPricing={false} showSettings={true}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Simple, Transparent Pricing</h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', margin: '0 auto 3rem', maxWidth: '48rem' }}>Choose the perfect plan for your content creation needs</p>
          {configError && (
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span style={{ fontWeight: '600' }}>{configError}</span>
            </div>
          )}

          {isDemoMode && !configError && (
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span style={{ fontWeight: '600' }}>Demo Mode Active: Payments are simulated</span>
            </div>
          )}
          {/* Billing Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '0.25rem' }}>
            <button onClick={() => setBillingCycle('monthly')} style={{ padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', border: 'none', cursor: 'pointer', backgroundColor: billingCycle === 'monthly' ? 'white' : 'transparent', color: billingCycle === 'monthly' ? '#111827' : '#6b7280', boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>Monthly</button>
            <button onClick={() => setBillingCycle('yearly')} style={{ padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', border: 'none', cursor: 'pointer', backgroundColor: billingCycle === 'yearly' ? 'white' : 'transparent', color: billingCycle === 'yearly' ? '#111827' : '#6b7280', boxShadow: billingCycle === 'yearly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Yearly
              <span style={{ fontSize: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>Save 20%</span>
            </button>
          </div>
        </section>

        {/* Region Indicator (Read-Only) */}
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            backgroundColor: isIndia ? '#fff7ed' : '#eff6ff',
            borderRadius: '12px',
            border: `1px solid ${isIndia ? '#fed7aa' : '#bfdbfe'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {userCountry === 'IN' ? '🇮🇳' : userCountry === 'US' ? '🇺🇸' : userCountry === 'GB' ? '🇬🇧' : '🌍'}
              </span>
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: isIndia ? '#c2410c' : '#1d4ed8' }}>
                {userCountry === 'IN' ? 'India Pricing' : userCountry === 'US' ? 'United States Pricing' : userCountry === 'GB' ? 'United Kingdom Pricing' : 'International Pricing'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: isIndia ? '#9a3412' : '#1e40af', margin: 0 }}>
              Pricing is based on your account region. Payment via {isIndia ? 'Razorpay (UPI, cards, net banking)' : 'PayPal (cards, PayPal balance)'}.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {plans.map((plan, idx) => (
              <div key={idx} style={{ position: 'relative', backgroundColor: 'white', borderRadius: '16px', border: plan.popular ? '2px solid #2563eb' : '1px solid #e5e7eb', padding: '2rem', boxShadow: plan.popular ? '0 10px 25px rgba(37,99,235,0.1)' : 'none' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563eb', color: 'white', padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>⭐ Most Popular</div>
                )}
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{plan.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{plan.description}</p>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827' }}>
                      {userCountry === 'IN' ? '₹' : userCountry === 'GB' ? '£' : '$'}
                      {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span style={{ color: '#6b7280' }}>/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '0.5rem' }}>
                      Save {userCountry === 'IN' ? '₹' : userCountry === 'GB' ? '£' : '$'}
                      {(plan.monthlyPrice * 12) - plan.yearlyPrice}/year
                    </p>
                  )}
                </div>
                <button onClick={async () => {
                  const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

                  if (amount === 0) {
                    alert(`You have selected the ${plan.name} plan. Welcome aboard!`);
                    // In a real app, we would update the user's subscription here
                    window.location.href = '/dashboard';
                    return;
                  }

                  const currency = isIndia ? 'INR' : 'USD';
                  const email = user?.email || 'guest@contextmatic.example.com';
                  const name = user?.id ? 'ContextMatic User' : 'Guest User';
                  if (isIndia) {
                    try {
                      await razorpayService.initiatePayment({ amount, currency, planName: plan.name, userEmail: email, userName: name });
                    } catch (e: any) {
                      console.error('Razorpay error', e);
                      alert(e?.message || 'Unable to start Razorpay checkout');
                    }
                  } else {
                    setSelectedPlan({ name: plan.name, amount });
                    setShowPaypalModal(true);
                  }
                }} style={{ width: '100%', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem', backgroundColor: plan.popular ? '#2563eb' : 'white', color: plan.popular ? 'white' : '#111827', border: plan.popular ? 'none' : '1px solid #d1d5db' }}>
                  {(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice) === 0 ? 'Get Started' : (isIndia ? 'Buy with Razorpay' : 'Buy with PayPal')}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0, marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      <span style={{ color: '#111827' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PayPal Modal */}
        {showPaypalModal && (
          <div onClick={() => setShowPaypalModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', margin: '1rem' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{selectedPlan ? `${selectedPlan.name} Plan - $${selectedPlan.amount}` : 'Checkout'}</h3>
                <button onClick={() => setShowPaypalModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#6b7280', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Complete your payment with PayPal</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>You'll be redirected to the dashboard after successful payment</p>
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #dbeafe' }}>
                  <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ℹ️</span>
                    <span><strong>No PayPal account?</strong> Click the "Pay with Debit or Credit Card" button below.</span>
                  </p>
                </div>
              </div>
              {configError && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c' }}>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{configError}</p>
                </div>
              )}
              <div id="paypal-button-container" style={{ minHeight: '150px' }} />

            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #e5e7eb', padding: '3rem 1.5rem', marginTop: '4rem' }}>
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            © 2024 ContextMatics. All rights reserved.
          </div>
        </footer>
      </div>
    </PageLayout>
  );
};

export default PricingPage;
