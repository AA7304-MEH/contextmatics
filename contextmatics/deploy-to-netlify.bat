@echo off
echo Installing Netlify CLI...
npm install -g netlify-cli

echo.
echo Logging into Netlify...
netlify login

echo.
echo Deploying to Netlify...
netlify deploy --prod --dir=dist

echo.
echo Deployment complete! Check the URL above.
pause