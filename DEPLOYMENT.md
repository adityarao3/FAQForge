# FAQForge Deployment Guide - Render

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas account (for cloud database)
- OpenAI API key

---

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - FAQForge with Neo-Brutalism UI"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository named `faqforge`
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/faqforge.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Setup MongoDB Atlas (Database)

1. **Create Free Cluster**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up/Login
   - Create a new FREE cluster (M0)
   - Choose a cloud provider and region

2. **Configure Database Access**:
   - Go to "Database Access"
   - Add a new database user
   - Choose "Password" authentication
   - Save username and password (you'll need this)
   - Set permissions to "Read and write to any database"

3. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Render to connect

4. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `faqforge`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/faqforge?retryWrites=true&w=majority`

---

## Step 3: Deploy Backend on Render

1. **Create New Web Service**:
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (`faqforge`)

2. **Configure Service**:
   - **Name**: `faqforge-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   OPENAI_API_KEY=<your-openai-api-key>
   OPENAI_MODEL=gpt-4o
   OPENAI_MAX_TOKENS=2000
   OPENAI_TEMPERATURE=0.7
   MAX_CRAWL_DEPTH=3
   MAX_PAGES_PER_DOMAIN=20
   CRAWL_TIMEOUT=10000
   ```

   **Important**: Replace the values in `< >` with your actual credentials!

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be available at: `https://faqforge-backend.onrender.com`

5. **Verify Deployment**:
   - Visit: `https://faqforge-backend.onrender.com/api/health`
   - You should see: `{"status":"OK","message":"FAQForge API is running",...}`

---

## Step 4: Deploy Frontend on Render

1. **Update Frontend API URL**:
   Before deploying, update the frontend to use your Render backend URL.
   
   In `frontend/src/services/api.js`, the code already uses:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
   ```

2. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Select your `faqforge` repository

3. **Configure Static Site**:
   - **Name**: `faqforge-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://faqforge-backend.onrender.com/api
   ```
   Replace with your actual backend URL from Step 3!

5. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment
   - Your frontend will be available at: `https://faqforge-frontend.onrender.com`

---

## Step 5: Update Backend CORS

After frontend is deployed, update the backend environment variable:

1. Go to your backend service on Render
2. Go to "Environment"
3. Add new environment variable:
   ```
   FRONTEND_URL=https://faqforge-frontend.onrender.com
   ```
4. Click "Save Changes"
5. Service will automatically redeploy

---

## 🎉 You're Done!

Your FAQForge application is now live!

- **Frontend**: https://faqforge-frontend.onrender.com
- **Backend API**: https://faqforge-backend.onrender.com
- **Health Check**: https://faqforge-backend.onrender.com/api/health

---

## 📝 Important Notes

### Free Tier Limitations
- **Render Free Tier**: Services spin down after 15 minutes of inactivity
- **First request after inactivity**: May take 30-60 seconds (cold start)
- **MongoDB Atlas Free Tier**: 512 MB storage limit

### Troubleshooting

**Backend won't start?**
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check Render logs: Dashboard → Your Service → Logs

**Frontend can't connect to backend?**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running (visit health check endpoint)

**Database connection errors?**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials
- Ensure connection string format is correct

### Updating Your App

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy!

---

## 🔐 Security Recommendations

For production use:
1. Use environment-specific API keys
2. Implement rate limiting
3. Add authentication/authorization
4. Use specific IP whitelisting for MongoDB (not 0.0.0.0/0)
5. Enable HTTPS only
6. Add request validation
7. Implement proper error logging

---

## 💰 Upgrading from Free Tier

If you need better performance:
- **Render**: Upgrade to Starter ($7/month) for always-on service
- **MongoDB Atlas**: Upgrade for more storage and better performance
- **OpenAI**: Monitor usage and set billing limits

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify all environment variables
3. Test backend health endpoint
4. Check MongoDB Atlas connection
5. Review OpenAI API key and credits

---

**Happy Deploying! 🚀**
