declare global {
  interface Window {
    paypal: any
  }
}

export class PayPalService {
  private static instance: PayPalService

  static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService()
    }
    return PayPalService.instance
  }

  /**
   * Initialize PayPal payment
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

    // Get PayPal Client ID from environment variables
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

    if (!clientId) {
      throw new Error('PayPal Client ID not configured')
    }

    // Initialize PayPal Buttons
    if (window.paypal && window.paypal.Buttons) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `${planName} Subscription`,
              amount: {
                currency_code: currency,
                value: amount.toString()
              }
            }],
            payer: {
              email_address: userEmail,
              name: {
                given_name: userName
              }
            }
          })
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('PayPal payment successful:', details)
            this.handlePaymentSuccess(details)
          })
        },
        onCancel: (data: any) => {
          console.log('PayPal payment cancelled:', data)
        },
        onError: (error: any) => {
          console.error('PayPal payment error:', error)
          alert('Payment failed. Please try again.')
        }
      }).render('#paypal-button-container')
    } else {
      throw new Error('PayPal SDK not loaded')
    }
  }

  /**
   * Handle successful payment
   */
  private handlePaymentSuccess(details: any): void {
    console.log('PayPal payment completed successfully', details)

    // Show success message
    alert('PayPal payment successful! Thank you for subscribing to ContextMatic.')

    // You can redirect to dashboard or success page
    window.location.href = '/dashboard'
  }

  /**
   * Load PayPal SDK script
   */
  loadPayPalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        resolve()
        return
      }

      // Load PayPal SDK script
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load PayPal SDK'))
      document.head.appendChild(script)
    })
  }
}

// Export singleton instance
export const paypalService = PayPalService.getInstance()