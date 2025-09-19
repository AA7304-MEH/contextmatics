
export type PlanId = 'free' | 'pro' | 'business' | 'enterprise' | 'free_abuse';

export interface User {
    id: string;
    email: string;
    countryCode: string; // 'US', 'IN', etc.
    plan: PlanId;
    processingCredits: number;
}

export interface PricingTier {
    pro: {
        monthly: number;
        yearly: number;
    };
    business: {
        monthly: number;
        yearly: number;
    };
}

export interface UserPricingInfo {
    prices: PricingTier;
    currency: 'USD' | 'INR';
    currencySymbol: '$' | '₹';
}

export type TierId = 'tier1' | 'tier2';

export interface PlanFeature {
    name: string;
    pro: boolean | string;
    business: boolean | string;
    enterprise: boolean | string;
}

export enum RepurposeOption {
    SUMMARY = "summary",
    TWEET_THREAD = "tweet_thread",
    BLOG_POST = "blog_post",
    LINKEDIN_POST = "linkedin_post",
    EMAIL_NEWSLETTER = "email_newsletter",
}

// Types for Asynchronous Job Processing
export type JobStatus = 'queued' | 'processing' | 'analyzing' | 'complete' | 'failed';

export interface Job {
    id: string;
    status: JobStatus;
    progress: number;
    result?: string;
    error?: string;
    createdAt: number;
}

// Types for Razorpay Integration
export interface RazorpayPaymentSuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number; // in paise or cents
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: RazorpayPaymentSuccessResponse) => void;
    prefill: {
        name?: string;
        email: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss: () => void;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}