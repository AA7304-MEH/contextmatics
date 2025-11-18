import type { RazorpayOptions, RazorpayPaymentSuccessResponse } from '../types'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
    }
  }
}

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
      await this.loadRazorpaySDK()
      const {
        amount,
        currency,
        planName,
        userEmail,
        userName = 'ContextMatic User'
      } = options

      // Get API key from environment variables
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

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
          console.log('Payment successful:', response)
          this.handlePaymentSuccess(response, planName, amount)
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
  private handlePaymentSuccess(response: RazorpayPaymentSuccessResponse, planName: string, amount: number): void {
    // Here you would typically:
    // 1. Verify payment with your backend
    // 2. Update user's subscription status
    // 3. Send confirmation email
    // 4. Redirect to success page

    console.log('Payment completed successfully', {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      plan: planName,
      amount: amount,
    })

    // Store payment info in localStorage for demo purposes
    // In production, this should be verified and stored on backend
    const paymentInfo = {
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      plan: planName,
      amount: amount,
      timestamp: Date.now(),
      status: 'success'
    }
    
    try {
      localStorage.setItem('lastPayment', JSON.stringify(paymentInfo))
    } catch (e) {
      console.error('Failed to store payment info:', e)
    }

    // Show success message or redirect
    alert(`Payment successful! Thank you for subscribing to ${planName} plan.`)

    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  /**
   * Create subscription order
   */
  async createSubscriptionOrder(planId: string, amount: number): Promise<string> {
    // In a real application, this would call your backend API
    // to create an order and return the order ID

    // For now, we'll simulate order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    console.log(`Created order ${orderId} for plan ${planId} with amount ${amount}`)

    return orderId
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