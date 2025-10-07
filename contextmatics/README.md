# ContextMatic - AI Content Repurposing Platform

🚀 **Transform any content into multiple formats with the power of AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## 🌟 Features

### ✨ Enhanced Signup Experience
- **Social Login Integration**: Google and GitHub OAuth support
- **Password Strength Indicator**: Real-time visual feedback
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Works perfectly on all devices

### 💳 Advanced Payment Integration
- **Multi-Gateway Support**: Razorpay and PayPal integration
- **Webhook Processing**: Automated payment status updates
- **Error Handling**: Robust retry mechanisms and user feedback
- **Payment Status Tracking**: Real-time payment monitoring

### 🔄 Smart Subscription Management
- **Automated Renewals**: Seamless subscription lifecycle
- **Expiry Tracking**: Days until subscription expiry
- **Renewal Reminders**: Automated email reminders (7, 3, 1 days)
- **Health Monitoring**: Subscription status indicators

### 🎨 Beautiful Landing Page
- **Smooth Animations**: Fade-in effects and hover animations
- **Testimonials Carousel**: Auto-rotating customer testimonials
- **Interactive Elements**: Engaging hover effects and transitions
- **Modern Design**: Clean, professional aesthetic

### 🔍 SEO Optimization
- **Structured Data**: JSON-LD schema markup
- **Meta Tags**: Comprehensive SEO meta tags
- **Sitemap**: Auto-generated sitemap.xml
- **Performance**: Optimized for search engines

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/contextmatic.git
   cd contextmatic/contextmatics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key_id
   PAYPAL_CLIENT_ID=your_paypal_client_id
   API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
contextmatics/
├── public/                    # Static assets
│   ├── _redirects            # SPA routing rules
│   └── assets/               # Images, icons, etc.
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── LandingPage.tsx  # Enhanced landing page
│   │   ├── PricingPage.tsx  # Payment integration
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── SubscriptionManager.tsx # Subscription management
│   │   └── ui/               # Reusable UI components
│   ├── context/              # React context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── ThemeContext.tsx  # Theme management
│   │   └── ToastContext.tsx  # Toast notifications
│   ├── services/             # API services
│   │   ├── api.ts            # Main API service
│   │   ├── geminiService.ts  # AI integration
│   │   ├── razorpayService.ts # Payment processing
│   │   ├── paypalService.ts  # PayPal integration
│   │   └── subscriptionService.ts # Subscription management
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── dist/                     # Build output (auto-generated)
├── vercel.json               # Vercel deployment config
├── DEPLOYMENT.md             # Detailed deployment guide
├── deploy.sh                 # Automated deployment script
└── package.json              # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Deployment
./deploy.sh          # Run deployment script
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "feat: Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Build settings are auto-detected from `vercel.json`

3. **Configure Environment Variables**
   - In Vercel dashboard: Settings > Environment Variables
   - Add your API keys and secrets

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using Vercel CLI
vercel --prod

# Or drag and drop the dist folder to Vercel deployment page
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAZORPAY_KEY_ID` | Razorpay payment gateway key | Yes |
| `PAYPAL_CLIENT_ID` | PayPal client ID | Yes |
| `API_KEY` | Google Gemini API key | Yes |

## 🎯 Key Features Deep Dive

### AI Content Repurposing
- **Multi-format Generation**: Transform content into tweets, blogs, LinkedIn posts, newsletters
- **Context Preservation**: Maintains original meaning across all formats
- **Quality Optimization**: AI-powered content enhancement

### Payment Processing
- **Geo-pricing**: Different prices for different regions (USD/INR)
- **Multiple Gateways**: Support for cards, UPI, PayPal
- **Subscription Management**: Automated billing and renewals

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Built-in theme switching
- **Accessibility**: WCAG compliant interface

## 🔒 Security

- **Input Validation**: Comprehensive client and server-side validation
- **Payment Security**: PCI compliant payment processing
- **Data Protection**: Secure API key management
- **XSS Prevention**: Built-in security headers

## 📊 Performance

- **Fast Loading**: Optimized bundle size and lazy loading
- **CDN Ready**: Static asset optimization
- **Caching Strategy**: Intelligent cache management
- **Mobile Optimized**: Touch-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for content generation
- **Razorpay** for payment processing
- **PayPal** for international payments
- **Tailwind CSS** for styling
- **React** ecosystem for the framework

## 📞 Support

For support, email support@contextmatic.example.com or create an issue in the GitHub repository.

---

**Made with ❤️ by the ContextMatic Team**

⭐ If you found this project helpful, please give it a star!

🎉 **Ready to transform your content creation workflow?** Get started today!