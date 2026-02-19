# ContextMatic 🚀

**ContextMatic** is an AI-powered content repurposing platform that helps creators transform text into engaging videos, blog posts, and social media threads.

## Features ✨

-   **AI Content Repurposing**: Transform context snippets into high-quality content.
-   **AI Video Generator**: Turn text prompts into short-form videos (Reels, TikTok).
-   **Cloud Sync**: Save your snippets and generations securely to the cloud (Supabase).
-   **Usage Analytics**: Track your content creation velocity with visual charts.
-   **Subscription Management**: Tiered plans (Free, Pro, Team) with Razorpay integration.
-   **Modern Tech SaaS UI**: Glassmorphism, dark mode, and spotlight effects built with Tailwind CSS.

## Tech Stack 🛠️

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS (v4), PostCSS
-   **State Management**: Context API (Auth, History, Toast)
-   **Backend / Database**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
-   **Payments**: Razorpay
-   **AI Integration**: Google Gemini (Text), AI Video Mock (Video)
-   **Charts**: Recharts
-   **Deployment**: Netlify / Vercel

## Getting Started 🏁

### Prerequisites

-   Node.js (v18+)
-   NPM (v9+)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/contextmatic.git
    cd contextmatic
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_Google_Generative_AI_API_KEY=your_gemini_key
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Deployment 🌍

### Build for Production

1.  **Run the build script:**
    ```bash
    npm run build
    ```
2.  The output will be in the `dist/` folder.

### Netlify / Vercel

-   **Netlify**: Connect your repo. Update `Build settings`:
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`
-   **Environment Variables**: Ensure all `.env` variables are added to the Netlify/Vercel dashboard.
-   **SPA Fallback**: Ensure you have a `_redirects` file (Netlify) or `vercel.json` configured for SPA routing.

## Project Structure 📂

```
src/
├── components/       # Atomic UI components and Feature Pages
├── config/           # Environment and App configuration
├── context/          # React Context Providers (Auth, History)
├── data/             # Mock data and constants
├── hooks/            # Custom React Hooks
├── lib/              # Third-party library configs (Supabase, Utils)
├── services/         # API Service layers (AI, Payments)
├── styles/           # Global CSS and Tailwind layers
├── types/            # TypeScript interfaces
├── App.tsx           # Main Router and Layout
└── main.tsx          # Entry point
```

## Contributing 🤝

Contributions are welcome! Please fork the repository and submit a Pull Request.

## License 📄

MIT License.