@echo off
echo 🚀 Deploying ContextMatic to Netlify...

echo Step 1: Building the application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully

echo Step 2: Deploying to Netlify...
netlify deploy --prod --dir=dist

if errorlevel 1 (
    echo ❌ Deployment failed!
    echo.
    echo 🔧 Manual deployment option:
    echo 1. Go to https://app.netlify.com/
    echo 2. Click "Add new site" ^> "Deploy manually"
    echo 3. Upload the contents of the 'dist' folder
    echo 4. Set publish directory to 'dist'
    pause
    exit /b 1
)

echo ✅ Deployment completed!
echo 🌟 Your site should be live in a few moments
pause