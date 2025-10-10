#!/bin/bash

# ContextMatic Deployment Script for Netlify
# This script helps deploy the application to Netlify

echo "🚀 Starting ContextMatic deployment process for Netlify..."

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

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm i -g netlify-cli

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Netlify CLI"
        exit 1
    fi
fi

echo "✅ Netlify CLI is ready"

# Deployment instructions
echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps for Netlify deployment:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy: Update application for production'"
echo "   git push origin main"
echo ""
echo "2. Install Netlify CLI (if not already installed):"
echo "   npm i -g netlify-cli"
echo ""
echo "3. Deploy to Netlify:"
echo "   netlify deploy --prod --dir=dist"
echo ""
echo "4. Alternative: Connect GitHub repository to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Click 'Add New Site' > 'Import an existing project'"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: dist"
echo "   - Add environment variables in site settings"
echo ""
echo "5. Set environment variables in Netlify dashboard:"
echo "   - Go to your site dashboard"
echo "   - Navigate to Site Settings > Environment Variables"
echo "   - Add the following variables:"
echo "     * RAZORPAY_KEY_ID: your_razorpay_key_id"
echo "     * PAYPAL_CLIENT_ID: your_paypal_client_id"
echo "     * API_KEY: your_gemini_api_key"
echo ""
echo "6. Custom domains (optional):"
echo "   - Add your custom domain in Netlify dashboard"
echo "   - Update sitemap.xml with your domain"
echo ""
echo "🌟 Your application will be live at: https://your-site-name.netlify.app"
echo ""
echo "📞 For support, check the README.md file"