import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ModernNav } from './shared/ModernNav';
import { Footer } from './shared/Footer';
import { SEO } from './shared/SEO';
import { razorpayService } from '../services/razorpayService';

// Data preserved
const countryPlans: any = {
  IN: [
    { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, features: ['5 credits/mo', 'Basic Support'] },
    { name: 'Pro', monthlyPrice: 599, yearlyPrice: 6400, popular: true, features: ['200 credits/mo', 'HD Export', 'Priority Support'] },
    { name: 'Enterprise', monthlyPrice: 1499, yearlyPrice: 16000, features: ['Unlimited', 'Team Seats', 'API Access'] },
  ],
  DEFAULT: [
    { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, features: ['5 credits/mo', 'Basic Support'] },
    { name: 'Pro', monthlyPrice: 22, yearlyPrice: 237, popular: true, features: ['200 credits/mo', 'HD Export', 'Priority Support'] },
    { name: 'Enterprise', monthlyPrice: 45, yearlyPrice: 486, features: ['Unlimited', 'Team Seats', 'API Access'] },
  ]
};

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const userCountry = user?.countryCode === 'IN' ? 'IN' : 'DEFAULT';
  const plans = countryPlans[userCountry];

  return (
    <div className="bg-background-primary min-h-screen pt-16 font-sans text-text-primary">
      <ModernNav />

      <SEO title="Pricing Plans" description="Choose the perfect plan for your AI content creation needs." />
      <div className="container mx-auto px-6 py-24 text-center">
        {/* ... existing header content ... */}
        <span className="text-brand-primary font-medium text-sm border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
          Pricing
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          Simple, transparent pricing.
        </h1>
        <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-12">
          Start building for free, then add a plan to go faster.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-white/5 rounded-full p-1 border border-white/10 mb-16 backdrop-blur-sm">
          {['monthly', 'yearly'].map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle as any)}
              className={`px-6 py-2 rounded-full font-medium text-sm capitalize transition-all duration-300 ${billingCycle === cycle ? 'bg-white text-black shadow-lg' : 'text-text-muted hover:text-white'
                }`}
            >
              {cycle}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          {plans.map((plan: any, i: number) => (
            <div
              key={i}
              className={`card group relative rounded-3xl p-8 flex flex-col transition-all duration-300 bg-background-surface/50 border ${plan.popular
                ? 'border-brand-primary/50 ring-1 ring-brand-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]'
                : 'border-white/10 hover:border-white/20'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-primary to-blue-600 text-white text-[10px] font-bold uppercase px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl shadow-lg z-20">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="text-5xl font-bold text-white mb-8 tracking-tighter">
                {userCountry === 'IN' ? '₹' : '$'}{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                <span className="text-sm font-medium text-text-muted ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((f: string, j: number) => (
                  <div key={j} className="flex items-center gap-3 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <PricingButton
                planName={plan.name}
                price={billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                currency={userCountry === 'IN' ? 'INR' : 'USD'}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};


// ... (existing imports)

const PricingButton = ({ planName, price, currency }: { planName: string, price: number, currency: string }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleSelect = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (planName === 'Free') {
      showToast('You are already on the Free plan.', 'info');
      return;
    }

    try {
      await razorpayService.initiatePayment({
        amount: price,
        currency: currency,
        planName: planName,
        userEmail: user.email,
        userName: user.fullName || user.username
      });
    } catch (error) {
      console.error("Payment initiation failed", error);
      showToast('Could not start payment. Please try again.', 'error');
    }
  };

  // const isCurrentPlan = user?.plan === planName.toLowerCase().replace(' ', ''); // approximation
  // Better check:
  const isPro = user?.plan === 'pro' && planName === 'Pro';
  const isEnterprise = user?.plan === 'enterprise' && planName === 'Enterprise';
  const isFree = user?.plan === 'free' && planName === 'Free';
  const isActive = isPro || isEnterprise || isFree;

  return (
    <button
      onClick={handleSelect}
      disabled={isActive}
      className={`w-full btn py-4 text-base justify-center ${planName === 'Pro'
        ? 'btn-primary bg-white text-black hover:bg-zinc-200 border-none'
        : 'btn-secondary'
        } ${isActive ? 'opacity-50 cursor-default' : ''}`}>
      {isActive ? 'Current Plan' : (planName === 'Free' ? 'Downgrade' : 'Upgrade')}
    </button>
  );
}

export default PricingPage;

