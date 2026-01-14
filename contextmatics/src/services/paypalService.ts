

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
    try {
      const { amount, currency, planName } = options

      // Get PayPal Client ID from environment variables
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

      // Check for Demo Mode (if clientId is missing or dummy)
      if (!clientId || clientId.includes('dummy')) {
        console.log('🤖 DEMO MODE: Simulating PayPal payment flow for', planName);

        const container = document.getElementById('paypal-button-container');
        if (container) {
          container.innerHTML = `
                 <div style="padding: 20px; text-align: center; border: 2px dashed #3b82f6; border-radius: 8px; background: #eff6ff;">
                     <h4 style="color: #1e40af; margin-bottom: 10px;">🔌 Demo Mode (No Real Payment)</h4>
                     <p style="margin-bottom: 15px; color: #1e3a8a;">Click below to simulate a successful PayPal transaction.</p>
                     <button id="mock-paypal-btn" style="background: #0070ba; color: white; padding: 10px 20px; border-radius: 20px; border: none; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; gap: 8px;">
                        <i>P</i> PayPal <span style="font-weight: normal">Checkout</span>
                     </button>
                 </div>
             `;

          const btn = document.getElementById('mock-paypal-btn');
          if (btn) {
            btn.onclick = () => {
              const mockDetails = {
                id: 'PAYID-' + Math.random().toString(36).substring(7).toUpperCase(),
                payer: { payer_id: 'DEMO-PAYER-' + Math.random().toString(36).substring(7) },
                status: 'COMPLETED'
              };
              this.handlePaymentSuccess(mockDetails, planName, amount);
            };
          }
        }
        return;
      }

      if (!clientId) {
        throw new Error('PayPal Client ID not configured. Please add VITE_PAYPAL_CLIENT_ID to your environment variables.')
      }

      // Check if PayPal SDK is loaded
      if (!window.paypal || !window.paypal.Buttons) {
        throw new Error('PayPal SDK not loaded. Please ensure the SDK is loaded before initiating payment.')
      }

      // Clear any existing PayPal buttons
      const container = document.getElementById('paypal-button-container')
      if (container) {
        container.innerHTML = ''
      }

      // Initialize PayPal Buttons
      await window.paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `${planName} Subscription`,
              amount: {
                currency_code: currency,
                value: amount.toFixed(2)
              }
            }],
            application_context: {
              brand_name: 'ContextMatic',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW'
            }
          })
        },
        onApprove: (_data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('PayPal payment successful:', details)
            this.handlePaymentSuccess(details, planName, amount)
          })
        },
        onCancel: (_data: any) => {
          console.log('PayPal payment cancelled by user:', _data)
          alert('Payment was cancelled. You can try again when ready.')
        },
        onError: (error: any) => {
          console.error('PayPal payment error:', error)

          // specific check for the "No ack for postMessage onCancel" error
          const errorMessage = error?.message || JSON.stringify(error) || 'Unknown error'

          if (errorMessage.includes('No ack for postMessage onCancel')) {
            console.log('Suppressing "No ack" error as it usually indicates window closure/cancellation')
            return
          }

          alert(`Payment failed: ${errorMessage}. Please check your configuration.`)
        }
      }).render('#paypal-button-container')
    } catch (error) {
      console.error('PayPal payment initialization failed:', error)
      throw error
    }
  }

  /**
   * Handle successful payment
   */
  private handlePaymentSuccess(details: any, planName: string, amount: number): void {
    console.log('PayPal payment completed successfully', {
      orderId: details.id,
      payerId: details.payer?.payer_id,
      status: details.status,
      plan: planName,
      amount: amount
    })

    // Store payment info in localStorage for demo purposes
    // In production, this should be verified and stored on backend
    const paymentInfo = {
      paymentId: details.id,
      payerId: details.payer?.payer_id,
      plan: planName,
      amount: amount,
      timestamp: Date.now(),
      status: 'success',
      method: 'paypal'
    }

    try {
      localStorage.setItem('lastPayment', JSON.stringify(paymentInfo))
    } catch (e) {
      console.error('Failed to store payment info:', e)
    }

    // Show success message
    alert(`PayPal payment successful! Thank you for subscribing to ${planName} plan.`)

    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  /**
   * Load PayPal SDK script
   */
  loadPayPalSDK(currency: string = 'USD'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if PayPal SDK is already loaded
      if (window.paypal) {
        resolve()
        return
      }

      // Get PayPal Client ID
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID

      if (!clientId) {
        console.error('Failed to load PayPal SDK')
        reject(new Error('PayPal Client ID not configured. Please add VITE_PAYPAL_CLIENT_ID to your environment variables.'))
        return
      }

      // Load PayPal SDK script
      const script = document.createElement('script')
      // Disable Venmo and PayLater. Enable Card for guest checkout.
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons&enable-funding=card&disable-funding=paylater,venmo`
      console.log('Loading PayPal SDK:', sdkUrl)
      script.src = sdkUrl
      script.async = true
      script.onload = () => {
        console.log('PayPal SDK loaded successfully')
        resolve()
      }
      script.onerror = () => {
        console.error('Failed to load PayPal SDK')
        reject(new Error('Failed to load PayPal SDK. Please check your internet connection and try again.'))
      }
      document.head.appendChild(script)
    })
  }
}

// Export singleton instance
export const paypalService = PayPalService.getInstance()