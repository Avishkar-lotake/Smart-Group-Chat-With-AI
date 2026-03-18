# Vercel Deployment Guide

## 🚀 Ready for Deployment

Your application is now configured and ready for Vercel deployment!

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Set these in your Vercel dashboard under Environment Variables:

**Backend Variables:**
```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webai?retryWrites=true&w=majority
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here
```

**Frontend Variables:**
```
VITE_API_URL=https://your-app-name.vercel.app
```

### 2. Database Setup
- **MongoDB**: Create a free MongoDB Atlas cluster

### 3. API Keys
- **OpenRouter**: Get your API key from https://openrouter.ai/

## 🛠️ Deployment Steps

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from project root**:
```bash
vercel
```

4. **Follow the prompts**:
- Link to existing project or create new
- Confirm settings
- Deploy!

## 📁 Project Structure
```
├── Backend/          # Node.js API server
├── Frontend/         # React frontend
├── vercel.json       # Vercel configuration
└── README_DEPLOYMENT.md
```

## 🔧 Configuration Files Created
- `vercel.json` - Build and routing configuration
- `Backend/.env.example` - Environment variables template
- `Frontend/.env.example` - Frontend environment template
- Updated `vite.config.js` for production optimization
- Updated Socket.io CORS for production

## 🌐 After Deployment
1. Update your CORS origins in `server.js` with your actual Vercel URL
2. Test all functionality including:
   - User authentication
   - Project creation
   - AI chat functionality
   - Socket.io connections

## 🐛 Troubleshooting
- **Build fails**: Check all environment variables are set
- **Database connection**: Verify MongoDB Atlas URI
- **CORS issues**: Update origins in server.js
- **Socket.io issues**: Check API URL configuration

Your app is now ready for production! 🎉
