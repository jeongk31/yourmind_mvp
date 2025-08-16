#!/bin/bash

# 🚀 YourMind AI Counseling Service - Deployment Script
# This script helps you prepare and deploy your application

echo "🧠 YourMind AI Counseling Service - Deployment Helper"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "yourmind" ] || [ ! -d "yourmind-backend" ]; then
    echo "❌ Error: Please run this script from the root directory containing 'yourmind' and 'yourmind-backend' folders"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""

# Check current git status
echo "📊 Current Git Status:"
git status --short
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 You have uncommitted changes. Would you like to commit them now? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "Prepare for deployment: YourMind AI Counseling Service"
        echo "✅ Changes committed"
    else
        echo "⚠️  Please commit your changes before deploying"
        exit 1
    fi
fi

echo ""
echo "🚀 Deployment Preparation Complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy Backend to Render: https://render.com"
echo "3. Deploy Frontend to Vercel: https://vercel.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/yourmind.git"
    echo "   git push -u origin main"
fi

echo "🎉 Ready for deployment!" 