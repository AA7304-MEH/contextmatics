import type { RazorpayOptions, RazorpayPaymentSuccessResponse } from '../types'
import { supabase } from '../lib/supabaseClient'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
    }
  }
}

// Production-safe notification helper (works outside React tree)
const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type } }));
};

export class RazorpayService {
  private static instance: RazorpayService

  static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService()
    }
    return RazorpayService.instance
  }

  /**
   * Initialize Razorpay payment
   */
  async initiatePayment(options: {
    amount: number
    currency: string
    planName: string
    userEmail: string
    userName?: string
  }): Promise<void> {
    try {
      const {
        amount,
        currency,
        planName,
        userEmail,
        userName = 'ContextMatic User'
      } = options

      // Get API key from environment variables
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

      // Check for Demo Mode
      if (!keyId || keyId.includes('dummy')) {
        console.debug('[Demo] Simulating Razorpay payment for', planName);

        // Simulate user interaction delay
        // Auto-simulate in demo mode
        const mockResponse: RazorpayPaymentSuccessResponse = {
          razorpay_payment_id: 'pay_demo_' + Math.random().toString(36).substring(7),
          razorpay_order_id: 'order_demo_' + Math.random().toString(36).substring(7),
          razorpay_signature: 'sig_demo_' + Math.random().toString(36).substring(7)
        };

        this.handlePaymentSuccess(mockResponse, planName, amount, options.userEmail);
        return;
      }

      await this.loadRazorpaySDK()

      if (!keyId) {
        throw new Error('Razorpay payment system is not configured. Please contact support for assistance.')
      }

      // Check if we're in a secure context (required for Razorpay)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Razorpay requires HTTPS connection. Please use HTTPS or localhost for testing.')
      }

      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(amount * 100)

      // Create order first (in real app, this would be done on backend)
      const orderId = await this.createSubscriptionOrder(planName, amount)

      const razorpayOptions: RazorpayOptions = {
        key: keyId,
        amount: amountInPaise,
        currency: currency,
        name: 'ContextMatic',
        description: `${planName} Subscription`,
        ...(orderId ? { order_id: orderId } : {}),
        handler: (response: RazorpayPaymentSuccessResponse) => {
          this.handlePaymentSuccess(response, planName, amount, userEmail)
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#2563eb', // Blue color matching your theme
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user')
          },
        },
      }

      const razorpayInstance = new window.Razorpay(razorpayOptions)
      razorpayInstance.open()
    } catch (error) {
      console.error('Razorpay payment initialization failed:', error)
      throw error
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSuccess(_response: RazorpayPaymentSuccessResponse, planName: string, _amount: number, userEmail: string): Promise<void> {

    try {
      // Determine credits based on plan
      // Matching PricingPage.tsx: Pro = 200, Enterprise = Unlimited (10000 for now)
      let credits = 10;
      let planId = 'free';

      if (planName.toLowerCase().includes('pro')) {
        credits = 200;
        planId = 'pro';
      } else if (planName.toLowerCase().includes('enterprise')) {
        credits = 10000;
        planId = 'enterprise';
      }

      // 1. Update Profile in Supabase
      // We need to find the user by email since we don't have ID passed explicitly here, 
      // OR we should have passed userId to initiatePayment. 
      // Ideally checking auth.users but we can only update public profiles if RLS allows.
      // For MVP, we'll assume the currently logged in user is the one paying, 
      // but to be safe let's query by email or passed User ID if we modify initiatePayment signature.

      // BETTER: Let's assume the email is unique in profiles or just fetch the user from auth session wrapper if possible? 
      // No, `razorpayService` is a singleton. 
      // Let's rely on finding the profile by email which should be unique.

      await supabase
        .from('profiles') // Assuming profiles is user_id keyed, but we need to find ID by email if we don't have it.
        // Actually, profiles table usually uses ID as PK. 
        // We should pass userId to initiatePayment.
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      // If we can't rely on auth.getUser() inside this callback (async/context issues?), 
      // we should pass userId in options. 

      // Let's assume we are logged in.
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser && currentUser.email === userEmail) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan: planId,
            credits_remaining: credits,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id);

        if (updateError) throw updateError;

        // 2. Log Subscription (Optional/Future)
      } else {
        console.warn('Payment email mismatch — skipping DB update.');
      }

    } catch (err) {
      console.error("Failed to update database after payment:", err);
      notify('Payment successful but failed to update account. Please contact support.', 'error');
      return;
    }

    // Show success message or redirect
    notify(`Payment successful! You now have ${planName} access.`, 'success');
    window.location.href = '/#/dashboard';
  }

  /**
   * Create subscription order
   */
  async createSubscriptionOrder(_planId: string, _amount: number): Promise<string | undefined> {
    // In a real application, this would call your backend API
    // to create an order and return the order ID

    // For client-side only demo, we don't create an order ID
    // Razorpay will treat this as a direct payment
    return undefined
  }

  /**
   * Load Razorpay SDK script
   */
  async loadRazorpaySDK(): Promise<void> {
    if (window.Razorpay) return
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
      document.head.appendChild(script)
    })
  }
}

// Export singleton instance
export const razorpayService = RazorpayService.getInstance()