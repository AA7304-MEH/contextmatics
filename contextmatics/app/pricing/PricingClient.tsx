"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ModernNav } from '@/components/shared/ModernNav';
import { Footer } from '@/components/shared/Footer';
import { razorpayService } from '@/services/razorpayService';

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

export default function PricingPage() {
    const { user } = useAuth();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const userCountry = user?.countryCode === 'IN' ? 'IN' : 'DEFAULT';
    const plans = countryPlans[userCountry];

    return (
        <div className="bg-[#050505] min-h-screen pt-16 font-sans text-white selection:bg-indigo-500/30">
            <ModernNav />

            <div className="container mx-auto px-6 py-24 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 animate-fade-in">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pricing & Plans</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    Scale Your Viral Content.
                </h1>

                <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-12 landing-relaxed">
                    Choose the plan that fits your growth. All pro plans include a <span className="text-white font-bold">14-day free trial</span>.
                </p>

                {/* Trial Banner */}
                <div className="max-w-4xl mx-auto mb-16 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <span className="text-lg">✨</span>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white">Experience the full power of AI Video Editor</p>
                            <p className="text-zinc-400 text-sm">No credit card required to start your 14-day Pro trial.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/sign-up')}
                        className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all text-sm"
                    >
                        Start My Free Trial
                    </button>
                </div>

                {/* Toggle */}
                <div className="inline-flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/10 mb-20">
                    {['monthly', 'yearly'].map(cycle => (
                        <button
                            key={cycle}
                            onClick={() => setBillingCycle(cycle as any)}
                            className={`px-8 py-2.5 rounded-xl font-bold text-sm capitalize transition-all duration-300 ${billingCycle === cycle ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            {cycle}
                            {cycle === 'yearly' && <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase">Save 20%</span>}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
                    {plans.map((plan: any, i: number) => (
                        <div
                            key={i}
                            className={`group relative rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 ${plan.popular
                                ? 'bg-indigo-600/5 border-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20'
                                : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                                } border`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase py-2 px-6 rounded-full shadow-xl shadow-indigo-600/40 z-20 tracking-tighter">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-extrabold text-white tracking-tighter">
                                        {userCountry === 'IN' ? '₹' : '$'}{billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                                    </span>
                                    <span className="text-zinc-500 font-medium">/mo</span>
                                </div>
                                {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                                    <p className="text-indigo-400 text-xs mt-2 font-bold italic">Billed annually (${plan.yearlyPrice}/yr)</p>
                                )}
                            </div>

                            <div className="space-y-5 mb-12 flex-1">
                                {plan.features.map((f: string, j: number) => (
                                    <div key={j} className="flex items-center gap-4 text-zinc-300 group-hover:text-white transition-colors duration-300">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white'}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-base">{f}</span>
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

                <div className="mt-24 max-w-2xl mx-auto p-10 rounded-3xl bg-white/[0.02] border border-white/10">
                    <h4 className="text-xl font-bold mb-4">Enterprise Grade Security</h4>
                    <p className="text-zinc-500 leading-relaxed mb-8">
                        Need more than just a plan? We offer custom solutions for agencies and video production houses.
                        SOC2 compliant, dedicated support, and white-labeling options.
                    </p>
                    <button className="text-white font-bold hover:text-indigo-400 transition-colors">
                        Talk to Sales →
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
