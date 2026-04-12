import type { RazorpayOptions, RazorpayPaymentSuccessResponse } from '../types'

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
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      // Check for Demo Mode (Only allowed in development/preview)
      const isTestKey = !keyId || keyId.includes('dummy') || keyId.includes('test');
      const isDev = process.env.NODE_ENV !== 'production';

      if (isTestKey && isDev) {
        // Auto-simulate in demo mode
        const mockResponse: RazorpayPaymentSuccessResponse = {
          razorpay_payment_id: 'pay_demo_' + Math.random().toString(36).substring(7),
          razorpay_order_id: 'order_demo_' + Math.random().toString(36).substring(7),
          razorpay_signature: 'sig_demo_' + Math.random().toString(36).substring(7)
        };

        this.handlePaymentSuccess(mockResponse, planName, amount, options.userEmail);
        return;
      }

      if (isTestKey && !isDev) {
        throw new Error('Production payment configuration error. Please contact support.');
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

      // Create order first (Validated on backend)
      const orderId = await this.createSubscriptionOrder(planName, currency)

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
            // Log for analytics if needed
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
  private async handlePaymentSuccess(response: RazorpayPaymentSuccessResponse, planName: string, _amount: number, userEmail: string): Promise<void> {
    try {
      // Call our backend verification API
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'razorpay',
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          planName,
          userEmail
        }),
      });

      const result = await verifyResponse.json();

      if (!verifyResponse.ok || !result.success) {
        throw new Error(result.error || 'Verification failed');
      }

      // Show success message or redirect
      notify(`Payment successful! You now have ${planName} access.`, 'success');
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error("Failed to verify payment:", err);
      notify(`Payment verification failed: ${err.message}. Please contact support.`, 'error');
    }
  }

  /**
   * Create subscription order
   */
  async createSubscriptionOrder(planName: string, currency: string): Promise<string> {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName, currency })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create order');
    return data.orderId;
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