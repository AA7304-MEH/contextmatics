# 🚀 NETLIFY DEPLOYMENT CONFIGURATION

## EXACT VALUES TO ENTER IN NETLIFY:

### 📂 **Base directory:**
```
contextmatics
```

### 🔨 **Build command:**
```
npm install && npm run build
```

### 📁 **Publish directory:**
```
dist
```

### 🌿 **Branch to deploy:**
```
main
```

### 🔧 **Functions directory:**
```
netlify/functions
```

---

## 🔑 ENVIRONMENT VARIABLES TO ADD AFTER DEPLOYMENT:

Go to **Site Settings → Environment Variables** and add these:

### Required Variables:
```
VITE_RAZORPAY_KEY_ID = rzp_test_1DPvRWapNJI0uV
VITE_PAYPAL_CLIENT_ID = your_paypal_client_id
VITE_GEMINI_API_KEY = AIzaSyCeDEzq6MMCBdaXoyQ0alpgZhTDpNOajF4
```

### Optional Analytics Variables:
```
VITE_GA_ID = your_google_analytics_id
VITE_MIXPANEL_TOKEN = your_mixpanel_token
VITE_SENTRY_DSN = your_sentry_dsn
```

---

## ✅ DEPLOYMENT CHECKLIST:

- [x] Repository: `AA7304-MEH/contextmatics` ✅
- [x] Branch: `main` ✅
- [x] Base directory: `contextmatics` ✅
- [x] Build command: `npm run build` ✅
- [x] Publish directory: `contextmatics/dist` ✅
- [ ] Click "Deploy site" button
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Add environment variables
- [ ] Test your live site!

---

## 🎯 WHAT HAPPENS NEXT:

1. **Netlify builds your site** (takes 2-3 minutes)
2. **You get a live URL** like: `https://amazing-name-123456.netlify.app`
3. **Every push to GitHub** = automatic redeployment
4. **Add environment variables** for full functionality
5. **Your site is live!** 🎉

---

## 🚨 TROUBLESHOOTING:

If build fails, check:
- Base directory is set to `contextmatics`
- Build command is `npm run build`
- Publish directory is `contextmatics/dist`

Your project is perfectly configured for Netlify! 🚀