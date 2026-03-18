export type PlanId = 'free' | 'pro' | 'business' | 'enterprise' | 'free_abuse';

export interface User {
    id: string;
    email: string;
    countryCode: string; // 'US', 'IN', etc.
    plan: PlanId;
    processingCredits: number;
    subscription?: SubscriptionInfo;
    role: 'user' | 'admin';
    // New fields mapped from 'profiles' table
    username?: string;
    fullName?: string;
    avatarUrl?: string;
}

export interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    plan: PlanId;
    credits_remaining: number;
    stripe_customer_id?: string;
    created_at: string;
    country_code?: string;
}

export interface Snippet {
    id: string;
    user_id: string;
    title: string;
    content: string;
    tags: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface Video {
    id: string;
    user_id: string;
    snippet_id?: string;
    prompt: string;
    platform: 'tiktok' | 'reels' | 'shorts';
    style: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    url?: string;
    thumbnail_url?: string;
    audio_url?: string;
    created_at: string;
}

export interface SubscriptionInfo {
    id: string;
    planId: PlanId;
    status: 'active' | 'expired' | 'cancelled' | 'past_due';
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    daysUntilExpiry?: number;
    autoRenew: boolean;
    paymentMethod?: PaymentMethod;
}

export interface PaymentMethod {
    type: 'card' | 'paypal' | 'upi';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
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
    order_id?: string;
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

// Types for Logo Maker
export type LogoTier = 'free' | 'basic' | 'premium';

export interface LogoStyle {
    id: string;
    name: string;
    prompt: string;
    image: string;
}

export interface LogoGenerationRequest {
    prompt: string;
    styleId: string;
    tier: LogoTier;
    width?: number;
    height?: number;
}

export interface LogoResult {
    imageUrl: string;
    prompt: string;
    tier: LogoTier;
    timestamp: number;
    styleId?: string;
    createdAt?: string;
}

// Types for Video Editor
export type TrackType = 'video' | 'audio' | 'text' | 'image';

export interface Clip {
    id: string;
    assetId: string;
    type: TrackType;
    name: string;
    startTime: number; // in seconds
    duration: number;
    startOffset: number; // For trimming: where the clip starts in the source asset
    trackId: string;
    url?: string;
    metadata?: any;
    effects?: {
        brightness?: number;
        contrast?: number;
        blur?: number;
        grayscale?: number;
        sepia?: number;
    };
    textConfig?: {
        fontSize?: number;
        color?: string;
        backgroundColor?: string;
        textAlign?: 'left' | 'center' | 'right';
        fontWeight?: string;
    };
    audioConfig?: {
        volume: number; // 0 to 100
        fadeIn: number; // duration in seconds
        fadeOut: number; // duration in seconds
    };
    transitions?: {
        in?: { type: 'fade' | 'slide-left' | 'zoom-in', duration: number };
        out?: { type: 'fade' | 'slide-right' | 'zoom-out', duration: number };
    };
}

export interface Track {
    id: string;
    type: TrackType;
    name: string;
    order: number;
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    timeline_data: {
        tracks: Track[];
        clips: Clip[];
        duration: number;
        zoom: number;
    };
    status: 'draft' | 'rendering' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}

export interface Asset {
    id: string;
    user_id: string;
    name: string;
    type: TrackType;
    url: string;
    thumbnail_url?: string;
    metadata?: any;
    created_at: string;
    updated_at: string;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
        paypal: any;
        LogoGenerator?: any;
    }
}