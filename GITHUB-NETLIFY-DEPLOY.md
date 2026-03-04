# 🚀 GitHub + Netlify Deployment Guide

## Step 1: Push to GitHub

### If you haven't initialized git yet:
```bash
git init
git add .
git commit -m "Initial commit: ContextMatic ready for deployment"
git branch -M main
git remote add origin https://github.com/AA7304-MEH/contextmatics.git
git push -u origin main
```

### If git is already set up:
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

## Step 2: Connect GitHub to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign in
2. **Click "Add new site"** → **"Import an existing project"**
3. **Choose "Deploy with GitHub"**
4. **Authorize Netlify** to access your GitHub account
5. **Select your repository:** `AA7304-MEH/contextmatics`
6. **Configure build settings:**
   - Base directory: `contextmatics`
   - Build command: `npm run build`
   - Publish directory: `contextmatics/dist`

## Step 3: Set Environment Variables

In Netlify dashboard → Site Settings → Environment Variables:
```
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Step 4: Deploy!

- Netlify will automatically build and deploy
- Every push to `main` branch = automatic deployment
- You'll get a URL like: `https://contextmatics-aa7304.netlify.app`

## 🎉 Benefits of GitHub Integration:
- ✅ Automatic deployments on every push
- ✅ Preview deployments for pull requests
- ✅ Easy rollbacks to previous versions
- ✅ Build logs and error tracking
- ✅ Custom domain support