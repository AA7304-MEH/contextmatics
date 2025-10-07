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
      throw new Error('Razorpay API key not configured')
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
      order_id: orderId,
      handler: (response: RazorpayPaymentSuccessResponse) => {
        console.log('Payment successful:', response)
        this.handlePaymentSuccess(response)
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
  }

  /**
   * Handle successful payment
   */
  private handlePaymentSuccess(response: RazorpayPaymentSuccessResponse): void {
    // Here you would typically:
    // 1. Verify payment with your backend
    // 2. Update user's subscription status
    // 3. Send confirmation email
    // 4. Redirect to success page

    console.log('Payment completed successfully', {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    })

    // Show success message or redirect
    alert('Payment successful! Thank you for subscribing to ContextMatic.')

    // You can redirect to dashboard or success page
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
}

// Export singleton instance
export const razorpayService = RazorpayService.getInstance()