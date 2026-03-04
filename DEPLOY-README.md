# 🚀 ContextMatic Deployment Guide

This guide provides step-by-step instructions to deploy ContextMatic to production.

## ✅ Pre-deployment Checklist

Before deploying, ensure you have:

- [ ] Updated all placeholder URLs in `robots.txt` and `sitemap.xml`
- [ ] Set up environment variables (see `.env.example`)
- [ ] Tested the build process (`npm run build`)
- [ ] Configured payment provider accounts (Razorpay/PayPal)
- [ ] Set up AI service API key (Google Gemini)

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment (GitHub Integration)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variables**
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```env
     RAZORPAY_KEY_ID=your_razorpay_key_id
     PAYPAL_CLIENT_ID=your_paypal_client_id
     API_KEY=your_gemini_api_key
     ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your site will be live at `https://your-project-name.vercel.app`

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Option 2: Netlify

#### Automatic Deployment (GitHub Integration)
1. **Push to GitHub** (see above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add New Site" > "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Set Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add your API keys

#### Manual Deployment
```bash
# Build the application
npm run build

# Deploy using Netlify CLI
npx netlify-cli deploy --prod --dir=dist
```

## 🔧 Environment Variables Setup

### Required Variables

Copy `.env.example` to `.env.local` and fill in your actual values:

```env
# Payment Gateway Keys
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# AI Service Key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Platform-Specific Setup

#### Vercel
- Add variables in project dashboard: Settings > Environment Variables
- Variable names should match `.env.example` (without `VITE_` prefix for some services)

#### Netlify
- Add variables in site dashboard: Site Settings > Environment Variables
- Use the names from `.env.example`

## 🛠️ Deployment Preparation Script

Use the included script to update placeholder URLs:

```bash
# Run the preparation script
npm run prepare-deployment

# Follow the prompts to enter your deployment URL
```

This script will:
- Update `robots.txt` with your domain
- Update `sitemap.xml` with your domain
- Update meta tags in `index.html`

## 📋 Post-deployment Steps

1. **Verify Deployment**
   - Check that your site loads correctly
   - Test all interactive elements
   - Verify payment integration works

2. **Set Up Custom Domain** (optional)
   - In your deployment platform dashboard
   - Add your custom domain
   - Update DNS settings

3. **Test Core Features**
   - Landing page loads
   - Authentication works
   - Payment flow functions
   - Content generation works

4. **Monitor and Maintain**
   - Set up error monitoring (optional)
   - Monitor API usage in payment dashboards
   - Update dependencies regularly

## 🔍 Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Check all dependencies are installed (`npm install`)
- Verify TypeScript compilation passes

### Payment Integration Issues
- Verify API keys are correct
- Check browser console for errors
- Ensure domain is whitelisted in payment providers

### Environment Variable Issues
- Double-check variable names match exactly
- Ensure variables are set in deployment platform
- Redeploy after adding new variables

## 📞 Support

For deployment issues:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test with different browsers
4. Check deployment platform logs

---

**🎉 Congratulations!** Your ContextMatic application is now ready for production!

For additional help:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)