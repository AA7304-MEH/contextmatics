# ContextMatic Deployment Guide

This guide provides comprehensive instructions for deploying ContextMatic to Vercel and other platforms.

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- GitHub account
- Vercel account

### Step 1: Environment Setup
1. Clone your repository:
   ```bash
   git clone https://github.com/your-username/contextmatic.git
   cd contextmatic/contextmatics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env.local`):
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key_id
   PAYPAL_CLIENT_ID=your_paypal_client_id
   API_KEY=your_gemini_api_key
   ```

### Step 2: Build and Test Locally
1. Build the application:
   ```bash
   npm run build
   ```

2. Test locally:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000` to verify everything works

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Set environment variables during deployment or in Vercel dashboard:
   - During CLI deployment, you'll be prompted to add variables
   - Or add them later in your project dashboard

#### Option B: GitHub Integration (Recommended)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: Prepare for production deployment"
   git push origin main
   ```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. Configure environment variables in Vercel dashboard:
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add your API keys and secrets

#### Option C: Manual Deploy
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder:
   - Drag and drop the `dist` folder to Vercel's deployment page
   - Or use Vercel CLI: `vercel --prod`

### Step 4: Post-Deployment
1. Verify deployment:
   - Check that your site loads correctly
   - Test all interactive elements
   - Verify payment integration works

2. Set up custom domain (optional):
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Update `sitemap.xml` with your domain

3. Monitor deployment:
   - Check the Functions tab for any errors
   - Monitor real-time logs in dashboard

## 🔧 Environment Variables

### Required Variables
```env
# Payment Gateway Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
PAYPAL_CLIENT_ID=your_paypal_client_id

# AI Service Key
API_KEY=your_gemini_api_key

# Optional: Database connection (if you add one later)
DATABASE_URL=your_database_url
```

### How to Set Environment Variables in Vercel
1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its value
4. Redeploy to apply changes

## 🏗️ Build Configuration

The application uses the following build configuration (defined in `vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

## 📁 Project Structure
```
contextmatics/
├── public/                 # Static assets
│   └── assets/            # Images, icons, etc.
├── src/                   # Source code
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript types
├── dist/                  # Build output (auto-generated)
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## 🧪 Testing Before Deployment

### Automated Testing
```bash
# Run tests (if you add them later)
npm test

# Build test
npm run build

# Type checking
npm run type-check
```

### Manual Testing Checklist
- [ ] Landing page loads correctly
- [ ] All animations work smoothly
- [ ] Signup form validation works
- [ ] Social login buttons are present
- [ ] Testimonials carousel functions
- [ ] Payment integration loads
- [ ] Subscription management works
- [ ] All links are functional
- [ ] Responsive design works on mobile
- [ ] SEO meta tags are present

## 🔍 Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version (needs 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

**Payment Integration Not Working**
- Verify Razorpay/PayPal keys are correct
- Check browser console for errors
- Ensure domain is whitelisted in payment providers

**Styling Issues**
- Clear browser cache
- Check if CSS files are loading
- Verify Tailwind configuration

**API Errors**
- Check API key is valid
- Verify network connectivity
- Check browser console for CORS errors

### Getting Help
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test with different browsers
4. Check Vercel function logs (if using serverless functions)

## 🚀 Performance Optimization

### Vercel Optimizations
- HTTP/2 enabled by default
- Automatic cache headers optimization
- Global CDN for static assets
- Automatic gzip compression
- Edge Functions for faster API responses

### Application Optimizations
- Code splitting is already configured
- Images are optimized
- CSS is minified in production
- JavaScript is minified and compressed

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use Vercel's environment variable system
- Rotate keys regularly

### Payment Security
- Payment keys are loaded client-side (normal for PCI compliance)
- Server-side validation should be added for production
- Use HTTPS in production (automatic with Vercel)

### Content Security
- Security headers are configured in `vercel.json`
- Input validation is implemented
- XSS protection is enabled

## 📞 Support and Maintenance

### Regular Tasks
- Monitor Vercel dashboard for errors
- Update dependencies regularly
- Check payment provider dashboards
- Monitor SEO performance

### Updates
1. Test changes locally first
2. Deploy to preview branch
3. Test thoroughly
4. Deploy to production
5. Monitor for issues

## 🌟 Production Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active (automatic)
- [ ] Payment providers configured
- [ ] Analytics added (optional)
- [ ] Monitoring set up (optional)
- [ ] Backup strategy in place
- [ ] Documentation updated

---

**Congratulations!** 🎉 Your ContextMatic application is now ready for production deployment on Vercel.

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Payment Provider Documentation](https://razorpay.com/docs/ or https://developer.paypal.com/)