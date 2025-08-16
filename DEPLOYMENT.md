# 🚀 Deployment Guide - YourMind AI Counseling Service

Complete step-by-step guide to deploy your application to Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Render account ([signup](https://render.com))
- [ ] Vercel account ([signup](https://vercel.com))
- [ ] OpenAI API key
- [ ] Your project code ready

## 🔧 Step 1: Prepare GitHub Repository

1. **Create a new GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: YourMind AI Counseling Service"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourmind.git
   git push -u origin main
   ```

2. **Repository structure should look like:**
   ```
   yourmind/
   ├── yourmind/           # Frontend React app
   ├── yourmind-backend/   # Backend Node.js API
   ├── README.md
   └── DEPLOYMENT.md
   ```

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Verify your email

### 2.2 Create New Web Service
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Select the repository** you just created

### 2.3 Configure the Service
- **Name**: `yourmind-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `yourmind-backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.4 Set Environment Variables
Click "Environment" tab and add:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://yourmind.vercel.app
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 2.5 Deploy
- Click **"Create Web Service"**
- Wait for build to complete
- Note your service URL: `https://yourmind-backend.onrender.com`

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Verify your email

### 3.2 Import Project
1. **Click "New Project"**
2. **Import Git Repository**
3. **Select your repository**

### 3.3 Configure Project
- **Framework Preset**: `Create React App`
- **Root Directory**: `yourmind`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3.4 Set Environment Variables
Add these environment variables:
```
REACT_APP_API_URL=https://yourmind-backend.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

### 3.5 Deploy
- Click **"Deploy"**
- Wait for build to complete
- Note your domain: `https://yourmind.vercel.app`

## 🔄 Step 4: Update Configuration

### 4.1 Update Backend CORS
In your Render backend, update the CORS origin:
```javascript
app.use(cors({
  origin: 'https://yourmind.vercel.app', // Your Vercel domain
  credentials: true
}));
```

### 4.2 Update Frontend API URL
In your Vercel frontend, ensure the API URL points to Render:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://yourmind-backend.onrender.com/api';
```

## 🧪 Step 5: Test Deployment

### 5.1 Test Backend
```bash
# Health check
curl https://yourmind-backend.onrender.com/

# API health
curl https://yourmind-backend.onrender.com/api/health

# Start conversation
curl -X POST https://yourmind-backend.onrender.com/api/chat/start \
  -H "Content-Type: application/json"
```

### 5.2 Test Frontend
- Open [https://yourmind.vercel.app](https://yourmind.vercel.app)
- Navigate to Chat page
- Try starting a conversation
- Verify API calls work

## 🔒 Step 6: Security & Monitoring

### 6.1 Environment Variables
- ✅ Never commit API keys to GitHub
- ✅ Use Render/Vercel environment variables
- ✅ Keep development and production keys separate

### 6.2 Monitoring
- **Render**: Check service logs and metrics
- **Vercel**: Monitor build status and performance
- **OpenAI**: Monitor API usage and costs

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables in Render
- Verify `PORT` is set correctly
- Check build logs for errors

#### Frontend Build Fails
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors
- Verify build command is correct

#### API Calls Fail
- Check CORS configuration
- Verify API URL in frontend
- Test backend endpoints directly

#### OpenAI API Errors
- Verify API key is correct
- Check API usage limits
- Ensure account has credits

### Debug Commands
```bash
# Check backend logs
# Go to Render dashboard → yourmind-backend → Logs

# Check frontend build logs
# Go to Vercel dashboard → yourmind → Deployments → Latest

# Test API locally
curl http://localhost:5001/api/health

# Test frontend locally
npm start
```

## 📊 Step 7: Post-Deployment

### 7.1 Custom Domain (Optional)
- **Vercel**: Add custom domain in project settings
- **Render**: Configure custom domain in service settings

### 7.2 Analytics (Optional)
- **Vercel Analytics**: Enable in project settings
- **Google Analytics**: Add tracking code
- **OpenAI Usage**: Monitor API costs

### 7.3 Backup & Recovery
- **GitHub**: Your code is safely stored
- **Environment Variables**: Document all variables
- **API Keys**: Keep backups of important keys

## 🎉 Success!

Your YourMind AI Counseling Service is now live at:
- **Frontend**: [https://yourmind.vercel.app](https://yourmind.vercel.app)
- **Backend**: [https://yourmind-backend.onrender.com](https://yourmind-backend.onrender.com)

## 🔄 Continuous Deployment

Both Render and Vercel will automatically redeploy when you push to your main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Vercel documentation
3. Check service logs for errors
4. Create an issue on GitHub

---

**Happy Deploying! 🚀**

Your AI counseling service is now accessible to users worldwide! 🌍 