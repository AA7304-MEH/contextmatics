"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';
import { razorpayService } from '@/services/razorpayService';
import { Check, Zap, Shield, Star, HelpCircle, ArrowRight, MessageSquare, Globe, Laptop, Crown } from 'lucide-react';

const countryPlans:any = {
    IN: [
        { id: 'free', name: 'Starter', monthlyPrice: 0, yearlyPrice: 0, credits: 5, description: 'Perfect for individual creators just getting started.', features: ['5 credits/mo', 'Basic AI Generation', '720p Video Export', '1 Active Workspace'] },
        { id: 'pro', name: 'Professional', monthlyPrice: 599, yearlyPrice: 6400, credits: 500, popular: true, description: 'For serious creators who need scale and speed.', features: ['500 credits/mo', 'HD Ultra Export', 'AI Image & Logo Gen', 'Priority Support', 'Advanced Scheduling'] },
        { id: 'agency', name: 'Agency', monthlyPrice: 1499, yearlyPrice: 16000, credits: 2000, description: 'Built for teams and high-volume marketing agencies.', features: ['2000 credits/mo', 'Unlimited Teams', 'Bulk Export', 'Custom Brand Voices', 'SLA Support'] },
    ],
    DEFAULT: [
        { id: 'free', name: 'Starter', monthlyPrice: 0, yearlyPrice: 0, credits: 5, description: 'Perfect for individual creators just getting started.', features: ['5 credits/mo', 'Basic AI Generation', '720p Video Export', '1 Active Workspace'] },
        { id: 'pro', name: 'Professional', monthlyPrice: 29, yearlyPrice: 280, credits: 500, popular: true, description: 'For serious creators who need scale and speed.', features: ['500 credits/mo', 'HD Ultra Export', 'AI Image & Logo Gen', 'Priority Support', 'Advanced Scheduling'] },
        { id: 'agency', name: 'Agency', monthlyPrice: 99, yearlyPrice: 950, credits: 2000, description: 'Built for teams and high-volume marketing agencies.', features: ['2000 credits/mo', 'Unlimited Teams', 'Bulk Export', 'Custom Brand Voices', 'SLA Support'] },
    ]
};

const FAQS = [
    { q: "How do credits work?", a: "Each AI generation (text, image, or video) consumes credits. Starter users get 5 free to try, while paid plans recharge monthly." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your account settings with no hidden fees." },
    { q: "Do you offer a refund policy?", a: "We want you to be happy. If ContextMatic doesn't save you time in the first 7 days, we'll refund you, no questions asked." }
];

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const userCountry = user?.countryCode === 'IN' ? 'IN' : 'DEFAULT';
    const plans = countryPlans[userCountry];

    const handleSelectPlan = async (plan:any) => {
        if (!user) {
            router.push(`/sign-up?plan=${plan.id}`);
            return;
        }

        if (plan.id === 'free') {
            showToast('You are already on the Starter plan.', 'info');
            return;
        }

        try {
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const currency = userCountry === 'IN' ? 'INR' : 'USD';

            showToast('Initiating secure checkout...', 'info');
            
            await razorpayService.initiatePayment({
                amount: price,
                currency: currency,
                planName: plan.name,
                userEmail: user.email,
                userName: user.fullName || user.username
            });
        } catch (error) {
            console.error("Payment initiation failed", error);
            showToast('Could not start payment. Please try again.', 'error');
        }
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8">
                        <Crown className="w-4 h-4 text-brand-primary mr-2" />
                        <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Early Access Pricing</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        Predictable Pricing for <br/><span className="text-brand-primary italic">Every Stage</span>
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Choose the plan that fits your growth. All pro plans include priority AI processing.
                    </p>
                    
                    {/* Billing Toggle */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-text-muted'}`}>Monthly</span>
                        <button 
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-white/10 rounded-full p-1 transition-all relative border border-white/5"
                        >
                            <div className={`w-5 h-5 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20 transition-all ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-text-muted'}`}>Yearly <span className="text-emerald-400 font-bold ml-1">(-20%)</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
                    {plans.map((plan:any) => {
                        const isActive = (user?.plan === plan.id.toLowerCase());
                        const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
                        
                        return (
                            <div 
                                key={plan.id}
                                className={`relative card p-8 flex flex-col border transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'bg-background-surface border-brand-primary/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]' : 'bg-background-surface/40 border-white/5 hover:border-white/10'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8 text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-extrabold text-white">{userCountry === 'IN' ? '₹' : '$'}{price}</span>
                                        <span className="text-text-muted">/month</span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed min-h-[48px]">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-bold text-white">{plan.credits} Credits</span>
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase tracking-tight">Included per month</p>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary text-left">
                                            <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-emerald-400" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isActive}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group ${isActive ? 'bg-white/5 text-text-muted cursor-not-allowed' : (plan.popular ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10')}`}
                                >
                                    {isActive ? 'Current Plan' : (plan.id === 'free' ? 'Get Started' : 'Upgrade Plan')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ & Trust Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left mb-20">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-8">
                                {FAQS.map((faq, i) => (
                                    <div key={i}>
                                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4 text-brand-primary" /> {faq.q}
                                        </h4>
                                        <p className="text-sm text-text-secondary leading-relaxed pl-6">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-background-surface/30 border border-white/5 p-10 rounded-[3rem] self-start backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Shield className="w-6 h-6 text-emerald-400" /> Enterprise Scale
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed mb-8">
                                Need custom volumes, API access, or white-labeling for your agency? We build bespoke engines for high-volume teams.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <MessageSquare className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-medium text-white">Dedicated Account Manager</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <Globe className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-medium text-white">Global Edge Processing</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <Laptop className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm font-medium text-white">SLA-Backed Performance</span>
                                </div>
                            </div>
                            <button className="btn btn-secondary w-full mt-10 py-4 justify-center">Contact Enterprise</button>
                        </div>
                    </div>

                    <div className="p-12 bg-gradient-to-br from-brand-primary/10 via-background-surface to-purple-600/10 border border-white/5 rounded-[40px] text-center backdrop-blur-md">
                         <div className="flex justify-center mb-6">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                         </div>
                         <p className="text-2xl font-bold text-white mb-4 italic">"ContextMatic saved our agency over 100 manual hours in the first month alone."</p>
                         <p className="text-sm text-text-muted">— Sarah Jenkins, Head of Growth @ Vortex Media</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
