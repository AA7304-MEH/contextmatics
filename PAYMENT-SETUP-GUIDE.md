# Payment Integration Setup Guide

## Overview
ContextMatic supports two payment gateways:
- **Razorpay** - For Indian customers (INR)
- **PayPal** - For international customers (USD and other currencies)

The system automatically detects the user's location and shows the appropriate payment option.

---

## 🔧 Configuration Required

### 1. Razorpay Setup (for Indian customers)

#### Get Your API Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Generate **Test Keys** for development or **Live Keys** for production
5. Copy the **Key ID** (starts with `rzp_test_` or `rzp_live_`)

#### Add to Environment Variables
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

**Important Notes:**
- Use **test keys** during development
- Switch to **live keys** only in production
- Never commit API keys to version control
- The Key Secret is NOT needed for frontend integration

---

### 2. PayPal Setup (for international customers)

#### Get Your Client ID
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Navigate to **My Apps & Credentials**
4. Create a new app or select an existing one
5. Copy the **Client ID** from the app details

#### Add to Environment Variables
```bash
VITE_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID_HERE
```

**Important Notes:**
- Use **Sandbox** credentials for testing
- Switch to **Live** credentials for production
- PayPal supports multiple currencies (USD, EUR, GBP, etc.)
- The Secret is NOT needed for frontend integration

---

## 📝 Environment Variables Setup

### Local Development
Create a `.env.local` file in the `contextmatics` directory:

```bash
# Razorpay (for Indian customers)
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE

# PayPal (for international customers)
VITE_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID_HERE
```

### Production Deployment (Vercel/Netlify)

#### For Vercel:
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `VITE_RAZORPAY_KEY_ID`
   - Value: Your Razorpay key
   - Click **Add**
4. Repeat for `VITE_PAYPAL_CLIENT_ID`
5. Redeploy your application

#### For Netlify:
1. Go to your site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add `VITE_RAZORPAY_KEY_ID` and `VITE_PAYPAL_CLIENT_ID`
5. Save and redeploy

---

## 🔍 How It Works

### Payment Flow

1. **User selects a plan** on the pricing page
2. **Location detection** determines payment gateway:
   - India (timezone: Asia/Kolkata) → Razorpay
   - Other countries → PayPal
3. **Payment gateway loads** the appropriate SDK
4. **User completes payment** in the payment modal
5. **Success handler** stores payment info and redirects to dashboard

### Currency Handling

- **Razorpay**: Automatically converts USD prices to INR (₹)
- **PayPal**: Uses USD or other supported currencies
- Amounts are properly formatted for each gateway

### Error Handling

The system includes comprehensive error handling:
- Missing API keys → Clear error message
- SDK loading failures → User-friendly alerts
- Payment cancellation → Graceful handling
- Network errors → Retry suggestions

---

## 🧪 Testing

### Razorpay Test Cards

Use these test cards in **Test Mode**:

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Declined |

- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **OTP**: 1234 (for test mode)

### PayPal Sandbox Testing

1. Create sandbox accounts at [PayPal Developer](https://developer.paypal.com/developer/accounts/)
2. Use sandbox credentials for testing
3. Test with sandbox buyer accounts

---

## 🔒 Security Best Practices

### ✅ DO:
- Use environment variables for API keys
- Use test/sandbox keys during development
- Verify payments on the backend (in production)
- Implement webhook handlers for payment verification
- Store payment records securely in a database
- Use HTTPS in production
- Rotate API keys regularly

### ❌ DON'T:
- Commit API keys to version control
- Use production keys in development
- Trust client-side payment verification alone
- Store sensitive payment data in localStorage (use for demo only)
- Expose API secrets in frontend code

---

## 🚀 Production Checklist

Before going live:

- [ ] Replace test API keys with live keys
- [ ] Set up backend payment verification
- [ ] Implement webhook handlers
- [ ] Set up proper database for payment records
- [ ] Enable payment gateway webhooks
- [ ] Test with real payment methods
- [ ] Set up monitoring and alerts
- [ ] Implement proper error logging
- [ ] Add payment receipt generation
- [ ] Set up refund handling
- [ ] Comply with PCI DSS requirements
- [ ] Add terms of service and privacy policy
- [ ] Implement subscription management
- [ ] Set up automated billing

---

## 🐛 Troubleshooting

### "Razorpay API key not configured"
- Check if `VITE_RAZORPAY_KEY_ID` is set in environment variables
- Ensure the key starts with `rzp_test_` or `rzp_live_`
- Restart the development server after adding variables

### "PayPal Client ID not configured"
- Check if `VITE_PAYPAL_CLIENT_ID` is set in environment variables
- Verify the Client ID is correct
- Restart the development server

### "Failed to load PayPal SDK"
- Check internet connection
- Verify Client ID is valid
- Check browser console for CORS errors
- Ensure no ad blockers are interfering

### Payment modal doesn't appear
- Check browser console for errors
- Verify SDK scripts are loading
- Check if modal container exists in DOM
- Disable browser extensions that might block popups

### Payment succeeds but doesn't redirect
- Check browser console for errors
- Verify success handler is being called
- Check if localStorage is available
- Ensure no JavaScript errors are preventing redirect

---

## 📚 Additional Resources

### Razorpay
- [Documentation](https://razorpay.com/docs/)
- [API Reference](https://razorpay.com/docs/api/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)

### PayPal
- [Documentation](https://developer.paypal.com/docs/)
- [JavaScript SDK](https://developer.paypal.com/sdk/js/)
- [Sandbox Testing](https://developer.paypal.com/tools/sandbox/)
- [Integration Guide](https://developer.paypal.com/docs/checkout/)

---

## 💡 Future Enhancements

Consider implementing:
- Backend payment verification API
- Webhook handlers for payment events
- Database integration for payment records
- Subscription management system
- Automated billing and invoicing
- Payment analytics dashboard
- Multiple currency support
- Additional payment gateways (Stripe, etc.)
- Promo codes and discounts
- Trial periods
- Refund processing

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check payment gateway dashboards for logs
5. Contact payment gateway support if needed

---

**Last Updated**: 2025-11-16
**Version**: 1.0.0
