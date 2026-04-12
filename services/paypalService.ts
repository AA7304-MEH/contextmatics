
declare global {
  interface Window {
    paypal: any
  }
}

// Production-safe notification helper (works outside React tree)
const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type } }));
};

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
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

      // Check for Demo Mode (if clientId is missing or dummy)
      if (!clientId || clientId.includes('dummy')) {
        // Simulating PayPal payment flow for demo mode
        const container = document.getElementById('paypal-button-container');
        if (container) {
          container.innerHTML = `
                 <div style="padding: 24px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; background: rgba(59, 130, 246, 0.03); backdrop-filter: blur(10px); color: white; font-family: inherit;">
                     <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                        <span style="display: block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 10px #3b82f6;"></span>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 900; text-transform: uppercase; tracking: 0.1em;">Development Sandbox</h4>
                     </div>
                     <p style="margin-bottom: 20px; color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 500;">The platform environment is currently running in a zero-risk simulated transaction mode.</p>
                     <button id="mock-paypal-btn" style="background: white; color: black; padding: 14px 24px; border-radius: 16px; border: none; font-size: 11px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; gap: 10px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-transform: uppercase; tracking: 0.2em; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                        Initiate Secure Simulation
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
            this.handlePaymentSuccess(details, planName, amount)
          })
        },
        onCancel: (_data: any) => {
          notify('Payment was cancelled. You can try again when ready.', 'info')
        },
        onError: (error: any) => {
          console.error('PayPal payment error:', error)

          // specific check for the "No ack for postMessage onCancel" error
          const errorMessage = error?.message || JSON.stringify(error) || 'Unknown error'

          if (errorMessage.includes('No ack for postMessage onCancel')) {
            return
          }

          notify(`Payment failed: ${errorMessage}. Please check your configuration.`, 'error')
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
  private async handlePaymentSuccess(details: any, planName: string, _amount: number): Promise<void> {
    try {
      // Call our backend verification API
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'paypal',
          paypal_details: details,
          planName
        }),
      });

      const result = await verifyResponse.json();

      if (!verifyResponse.ok || !result.success) {
        throw new Error(result.error || 'Verification failed');
      }

      // Show success message
      notify(`PayPal payment successful! Thank you for subscribing to ${planName}.`, 'success');

      // Redirect to dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error("Failed to verify PayPal payment:", err);
      notify(`Payment verification failed: ${err.message}. Please contact support.`, 'error');
    }
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

      // Get PayPal Client ID from environment variables
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

      if (!clientId) {
        reject(new Error('PayPal Client ID not configured. Please add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.'))
        return
      }

      // Load PayPal SDK script
      const script = document.createElement('script')
      // Disable Venmo and PayLater. Enable Card for guest checkout.
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons&enable-funding=card&disable-funding=paylater,venmo`
      script.src = sdkUrl
      script.async = true
      script.onload = () => {
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