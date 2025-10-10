#!/bin/bash

# ContextMatic Deployment Script for Vercel
# This script helps deploy the application to Vercel

echo "🚀 Starting ContextMatic deployment process for Vercel..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if build output exists
if [ ! -d "dist" ]; then
    echo "❌ Build output directory 'dist' not found"
    exit 1
fi

echo "✅ Build output verified"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm i -g vercel

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
fi

echo "✅ Vercel CLI is ready"

# Deployment instructions
echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy: Update application for production'"
echo "   git push origin main"
echo ""
echo "2. Install Vercel CLI (if not already installed):"
echo "   npm i -g vercel"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. Set environment variables in Vercel dashboard:"
echo "   - Go to your project dashboard"
echo "   - Navigate to Settings > Environment Variables"
echo "   - Add the following variables:"
echo "     * RAZORPAY_KEY_ID: your_razorpay_key_id"
echo "     * PAYPAL_CLIENT_ID: your_paypal_client_id"
echo "     * API_KEY: your_gemini_api_key"
echo ""
echo "5. Alternative: Connect GitHub repository to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'Add New...' > 'Project'"
echo "   - Import your GitHub repository"
echo "   - Vercel will auto-detect Vite configuration"
echo "   - Add environment variables in project settings"
echo ""
echo "6. Custom domains (optional):"
echo "   - Add your custom domain in Vercel dashboard"
echo "   - Update sitemap.xml with your domain"
echo ""
echo "🌟 Your application will be live at: https://your-project-name.vercel.app"
echo ""
echo "📞 For support, check the README.md file"