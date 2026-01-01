# 🚀 RENDER FIX - 2 MINUTE GUIDE

## ⚡ Quick Fix (Follow These Exact Steps)

### 1️⃣ Login to Render
- Go to: https://dashboard.render.com
- Login with your account (GitHub/GitLab/Google/Email)

### 2️⃣ Find Your Service
- You'll see a list of services
- Click on **"faqforge-backend"** (or whatever you named it)

### 3️⃣ Go to Settings
- Click the **"Settings"** tab at the top

### 4️⃣ Fix Build & Deploy Settings
Scroll down to **"Build & Deploy"** section and change:

```
┌─────────────────────────────────────┐
│ Root Directory                      │
│ ┌─────────────────────────────────┐ │
│ │ [DELETE EVERYTHING - LEAVE EMPTY]│ │  ← IMPORTANT!
│ └─────────────────────────────────┘ │
│                                     │
│ Build Command                       │
│ ┌─────────────────────────────────┐ │
│ │ npm install                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Start Command                       │
│ ┌─────────────────────────────────┐ │
│ │ npm start                        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 5️⃣ Save Changes
- Scroll to bottom
- Click **"Save Changes"** button

### 6️⃣ Redeploy
- Still in Settings, find **"Manual Deploy"** section
- Click **"Deploy latest commit"** button
- Wait 5-10 minutes

### 7️⃣ Check Logs
- Click **"Logs"** tab
- Look for: `🚀 Server running on port 10000`
- If you see it: **SUCCESS!** ✅

### 8️⃣ Test It
- Visit: `https://your-app-name.onrender.com/api/health`
- Should see: `{"status":"OK","message":"FAQForge API is running"}`

---

## 🎯 The Key Fix:

**Root Directory MUST be EMPTY!**

❌ WRONG: `src`  
❌ WRONG: `backend`  
❌ WRONG: `./`  
✅ CORRECT: [completely empty field]

---

## 📸 What You Should See:

After fixing and redeploying, your logs should show:

```
==> Building...
==> Running 'npm install'
added 150 packages...
==> Build successful!
==> Running 'npm start'

> faqforge@1.0.0 start
> node backend/server.js

🚀 Server running on port 10000
📝 Environment: production
✅ MongoDB connected successfully
```

---

## 🆘 Still Getting Error?

If you still see the error after following these steps:

1. **Check Environment Variables** (Settings → Environment):
   - Make sure `MONGODB_URI` is set
   - Make sure `OPENAI_API_KEY` is set
   - Make sure `NODE_ENV=production`

2. **Check Your GitHub Repo**:
   - Make sure `backend/server.js` exists
   - Make sure `package.json` exists

3. **Share with me**:
   - Screenshot of Settings → Build & Deploy
   - Last 20 lines from Logs tab

---

## ⏱️ Total Time: 2 Minutes

That's it! Just follow these 8 steps and your deployment will work! 🎉
