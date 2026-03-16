#!/bin/bash

echo "🚂 Railway Deployment Checker for PetConnect"
echo "=========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Run:"
    echo "railway login"
    exit 1
fi

echo "✅ Railway CLI is ready"

# Check backend files
echo ""
echo "📁 Checking backend files..."
if [ -f "Petconnet_BE/package.json" ] && [ -f "Petconnet_BE/server.js" ] && [ -f "Petconnet_BE/railway.json" ]; then
    echo "✅ Backend files are ready"
else
    echo "❌ Missing backend files"
fi

# Check frontend files
echo ""
echo "📁 Checking frontend files..."
if [ -f "Petconnet_FE/package.json" ] && [ -f "Petconnet_FE/vite.config.ts" ] && [ -f "Petconnet_FE/railway.json" ]; then
    echo "✅ Frontend files are ready"
else
    echo "❌ Missing frontend files"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Push code to GitHub repository"
echo "2. Go to https://railway.app/dashboard"
echo "3. Create new project from GitHub repo"
echo "4. Follow RAILWAY_DEPLOY.md for detailed instructions"

echo ""
echo "📖 See RAILWAY_DEPLOY.md for complete deployment guide"