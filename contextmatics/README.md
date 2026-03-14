# Contextmatic 🚀

AI-powered content repurposing platform for creators, marketers, and teams. Turn any idea into blog posts, social threads, videos, and newsletters in seconds.

## ✨ Features

- **AI Content Creator**: Generate polished blog posts, Twitter threads, and LinkedIn posts.
- **AI Video Generator**: Create videos from text prompts with professional UI.
- **Faceless Studio**: 4-step wizard for AI video automation (PRO).
- **Analytics Dashboard**: Track usage, credits, and content distribution with interactive charts.
- **Admin Tools**: Comprehensive user database and system overview.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Auth & Database**: [Supabase](https://supabase.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **AI Models**: Google Gemini & Replicate
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ 
- Supabase Project

### 2. Environment Setup

Create a `.env.local` file in the root directory and add the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Configuration (Comma-separated emails)
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# AI Settings
NEXT_PUBLIC_USE_MOCK_VIDEO=false # Set to true for demo mode
```

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

### 5. Production Build

```bash
npm run build
npm run start
```

## 📄 License

MIT © ContextMatic Team