import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPricing } from '../services/pricingService';
import { createRazorpayOrder } from '../services/razorpayService';
import { PLAN_FEATURES, RAZORPAY_KEY_ID } from '../constants';
import type { PlanId, RazorpayOptions } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { useToast } from '../context/ToastContext';
import Spinner from './ui/Spinner';
import PayPalButton from './PayPalButton';


interface PricingPageProps {
    showContinueButton?: boolean;
    onContinue?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ showContinueButton = false, onContinue }) => {
    const { user, upgradePlan } = useAuth();
    const { addToast } = useToast();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

    if (!user) return null;

    const { prices, currency, currencySymbol } = getUserPricing(user.countryCode);
    const isAbuse = user.plan === 'free_abuse';
    
    const handlePaymentSuccess = useCallback((planId: 'pro' | 'business') => {
        const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
        upgradePlan(planId);
        addToast(`Successfully upgraded to the ${planName} plan! Welcome aboard.`, 'success');
        setLoadingPlan(null);
    }, [upgradePlan, addToast]);
    
    const initiateRazorpayPayment = async (planId: 'pro' | 'business', price: number, paymentCurrency: 'USD' | 'INR') => {
        if (!user) return;

        setLoadingPlan(planId);

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_ID.startsWith('rzp_')) {
            addToast('Payment gateway is not configured correctly. Please contact support.', 'error');
            console.error('Razorpay Key ID is missing or invalid.');
            setLoadingPlan(null);
            return;
        }

        if (typeof window.Razorpay === 'undefined') {
            addToast('Payment gateway script failed to load. Please check your network or ad-blocker and refresh.', 'error');
            console.error('Razorpay checkout script (window.Razorpay) is not available.');
            setLoadingPlan(null);
            return;
        }

        try {
            // Step 1: Create an order from our (simulated) backend
            const orderDetails = await createRazorpayOrder(price, paymentCurrency, planId);

            // Step 2: Configure Razorpay options
            const options: RazorpayOptions = {
                key: RAZORPAY_KEY_ID,
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                name: 'ContextMatic',
                description: `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                order_id: orderDetails.orderId,
                handler: (response) => {
                    // Step 4: Handle successful payment
                    console.log('Payment successful:', response);
                    handlePaymentSuccess(planId);
                },
                prefill: {
                    email: user.email,
                },
                theme: {
                    color: '#4f46e5', // Indigo-600
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment modal dismissed by user.');
                        addToast('Payment was cancelled.', 'info');
                        setLoadingPlan(null);
                    }
                }
            };

            // Step 3: Open the Razorpay checkout modal
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Error initiating payment:', error);
            addToast('Could not initiate payment. Please try again.', 'error');
            setLoadingPlan(null);
        }
    };


    const PlanCard: React.FC<{
        planName: 'Pro' | 'Business';
        planId: 'pro' | 'business';
        description: string;
        planPrices: { monthly: number; yearly: number };
        isPopular?: boolean;
    }> = ({ planName, planId, description, planPrices, isPopular = false }) => {
        const displayPrice = billingCycle === 'monthly' ? planPrices.monthly : Math.round(planPrices.yearly / 12);
        const chargePrice = billingCycle === 'monthly' ? planPrices.monthly : planPrices.yearly;
        
        return (
            <div className={`relative border rounded-xl p-8 flex flex-col transition-all duration-300 ${isPopular ? 'border-indigo-500 border-2 shadow-2xl scale-105 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'}`}>
                {isPopular && (
                    <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                        <span className="bg-indigo-500 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase">Most Popular</span>
                    </div>
                )}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{planName}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-4 h-12">{description}</p>
                <div className="mt-6">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{currencySymbol}{displayPrice}</span>
                    <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/mo</span>
                </div>
                {billingCycle === 'yearly' && <p className="text-emerald-600 dark:text-emerald-400 mt-2 text-sm font-semibold">Billed as {currencySymbol}{planPrices.yearly}/year</p>}
                
                <div className="mt-8 h-[44px] flex items-center">
                    {currency === 'INR' ? (
                        <button
                            onClick={() => initiateRazorpayPayment(planId, chargePrice, currency)}
                            disabled={loadingPlan !== null}
                            className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex justify-center items-center h-[44px] ${isPopular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:from-slate-400 disabled:to-slate-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-600'}`}
                        >
                            {loadingPlan === planId ? <Spinner /> : 'Pay with Card / UPI'}
                        </button>
                    ) : (
                        <>
                            {loadingPlan !== null && loadingPlan !== planId ? (
                                 <div className="w-full flex justify-center items-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Processing payment...</p>
                                 </div>
                            ) : (
                                <div className="w-full">
                                    <PayPalButton
                                        planId={planId}
                                        amount={chargePrice}
                                        currency={currency}
                                        onSuccess={handlePaymentSuccess}
                                        setLoadingPlan={setLoadingPlan}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300 flex-grow">
                    {PLAN_FEATURES.map((feature) => (
                        <li key={feature.name} className="flex items-center">
                            <CheckIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <span>
                                {feature.name}: <span className="font-semibold text-slate-800 dark:text-slate-100">{typeof feature[planId] === 'string' ? feature[planId] : (feature[planId] ? 'Included' : 'Not Included')}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isAbuse && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg mb-8 flex items-center shadow-md">
                        <AlertTriangleIcon className="h-6 w-6 mr-3 text-red-500" />
                        <div>
                            <h3 className="font-bold">Multiple Accounts Detected</h3>
                            <p>Our system detected that you may have multiple free accounts. To continue, please upgrade to a paid plan.</p>
                        </div>
                    </div>
                )}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
                        Flexible pricing for teams of any size
                    </h1>
                     <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Welcome! Choose a plan to get started, or continue with the free Hobbyist plan.
                    </p>
                    {showContinueButton && (
                        <div className="mt-6">
                            <button onClick={onContinue} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors">
                                Continue to Dashboard &rarr;
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-10 flex justify-center">
                    <div className="relative rounded-full p-1 bg-slate-200 dark:bg-slate-700 flex items-center">
                         <span className="absolute -top-2 -right-2 transform rotate-12 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full z-10 animate-pulse">Save 17%</span>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-900 shadow text-gray-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-900 shadow text-gray-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-start">
                    {/* Free Plan */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col bg-white dark:bg-slate-800/50 h-full">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Hobbyist</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 h-12">For individuals getting started.</p>
                        <div className="mt-6">
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$0</span>
                            <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/forever</span>
                        </div>
                        <button
                            disabled={true}
                            className="mt-8 w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                        >
                            Current Plan
                        </button>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                             <li className="flex items-center"><CheckIcon className="w-5 h-5 text-emerald-500 mr-3" /><span>3 Repurposing Credits / month</span></li>
                             <li className="flex items-center"><CheckIcon className="w-5 h-5 text-emerald-500 mr-3" /><span>Basic Formats</span></li>
                             <li className="flex items-center"><AlertTriangleIcon className="w-5 h-5 text-yellow-500 mr-3" /><span>Watermarked Output</span></li>
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <PlanCard 
                        planName="Pro"
                        planId="pro"
                        description="For professionals and small teams who need more power and flexibility."
                        planPrices={prices.pro}
                        isPopular={true}
                    />

                    {/* Business Plan */}
                    <PlanCard 
                        planName="Business"
                        planId="business"
                        description="For large teams and agencies needing collaboration and API access."
                        planPrices={prices.business}
                    />

                    {/* Enterprise Plan */}
                     <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col bg-white dark:bg-slate-800/50 h-full">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Enterprise</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 h-12">For large-scale needs with custom solutions.</p>
                        <div className="mt-6">
                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Let's Talk</span>
                        </div>
                        <a
                            href="mailto:sales@contextmatic.example.com"
                            className="mt-8 w-full block text-center py-3 rounded-lg font-semibold transition-all transform hover:scale-105 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            Contact Sales
                        </a>
                        <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300 flex-grow">
                            {PLAN_FEATURES.map((feature) => (
                                <li key={feature.name} className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                                    <span>
                                        {feature.name}: <span className="font-semibold text-slate-800 dark:text-slate-100">
                                            {typeof feature.enterprise === 'string' ? feature.enterprise : (feature.enterprise ? 'Included' : 'Not Included')}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingPage;