# 🔧 Render Deployment Fix - Quick Reference

## ❌ The Error You Encountered

```
Error: Cannot find module '/opt/render/project/src/server.js'
```

## ✅ What Was Fixed

### 1. **Server Startup Logic** (`backend/server.js`)

**Before** (❌ Broken on Render):
```javascript
// Only starts in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, ...);
}
```

**After** (✅ Works on Render):
```javascript
// Starts everywhere except serverless (Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, ...);
}
```

**Why**: Render sets `NODE_ENV=production`, so the old code prevented the server from starting!

### 2. **Added Render Configuration** (`render.yaml`)

Created a proper configuration file that tells Render:
- Build command: `npm install`
- Start command: `npm start`
- Environment variables needed
- Health check endpoint

### 3. **Package.json Already Correct**

The start script was already pointing to the right location:
```json
"start": "node backend/server.js"
```

---

## 🚀 Deployment Checklist

### Before Deploying to Render:

- [x] ✅ Fixed server startup logic
- [x] ✅ Created `render.yaml` configuration
- [x] ✅ Health check endpoint exists (`/api/health`)
- [ ] 📝 Push code to GitHub
- [ ] 🗄️ Setup MongoDB Atlas
- [ ] 🔑 Get OpenAI API key
- [ ] 🌐 Create Render web service
- [ ] ⚙️ Add environment variables on Render

---

## 📝 Required Environment Variables on Render

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/faqforge
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
MAX_CRAWL_DEPTH=3
MAX_PAGES_PER_DOMAIN=20
CRAWL_TIMEOUT=10000
```

---

## 🧪 Testing After Deployment

1. **Health Check**:
   ```
   https://your-app.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"FAQForge API is running",...}`

2. **Check Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for: `🚀 Server running on port 10000`

3. **Test API**:
   ```
   https://your-app.onrender.com/api/crawl/websites
   ```
   Should return: `{"success":true,"data":[]}`

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Verify `package.json` start script points to `backend/server.js`

### Issue: "Port already in use"
**Solution**: Render automatically assigns PORT=10000, don't hardcode it

### Issue: "MongoDB connection failed"
**Solution**: 
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Verify connection string format
- Ensure database user has correct permissions

### Issue: "OpenAI API error"
**Solution**:
- Verify API key is correct
- Check OpenAI account has credits
- Ensure no extra spaces in environment variable

### Issue: "Service keeps restarting"
**Solution**:
- Check Render logs for actual error
- Verify all required environment variables are set
- Ensure MongoDB is accessible

---

## 📚 Full Documentation

For complete deployment instructions, see:
- `DEPLOYMENT.md` - Step-by-step deployment guide
- `PROJECT_SUMMARY.md` - Full project documentation
- `README.md` - Project overview

---

## 🎯 Next Steps

1. **Commit the fixes**:
   ```bash
   git add .
   git commit -m "Fix: Updated server startup for Render deployment"
   git push origin main
   ```

2. **Follow DEPLOYMENT.md** for complete deployment process

3. **Test thoroughly** after deployment

---

**The fix is complete! Your app is now ready for Render deployment! 🚀**
