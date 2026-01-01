# 🚨 URGENT FIX: Render Deployment Error

## Error You're Seeing:
```
Error: Cannot find module '/opt/render/project/src/server.js'
```

## 🎯 Root Cause:
Render is looking for `server.js` in the wrong location. It's looking in `/opt/render/project/src/` but your file is at `backend/server.js`.

---

## ✅ SOLUTION - Follow These Exact Steps:

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your service (probably named `faqforge` or `faqforge-backend`)

### Step 2: Update Service Settings
1. Click the **"Settings"** tab (top navigation)
2. Scroll down to **"Build & Deploy"** section
3. You'll see these fields:

   **Root Directory:**
   - **CURRENT (WRONG)**: Might be set to `src` or something else
   - **CHANGE TO**: Leave it **COMPLETELY EMPTY** or type just `.`
   
   **Build Command:**
   - **SET TO**: `npm install`
   
   **Start Command:**
   - **SET TO**: `npm start`

4. Click **"Save Changes"** button at the bottom

### Step 3: Trigger Manual Deploy
1. Go to the **"Manual Deploy"** section (still in Settings)
2. Click **"Deploy latest commit"** button
3. Wait for deployment (5-10 minutes)

### Step 4: Check Logs
1. Go to **"Logs"** tab
2. Look for this line:
   ```
   🚀 Server running on port 10000
   📝 Environment: production
   ```
3. If you see that, SUCCESS! ✅

---

## 🔍 Verify Your Settings Look Like This:

```
Root Directory: [EMPTY or .]
Build Command: npm install
Start Command: npm start
```

**NOT** like this (WRONG):
```
Root Directory: src  ❌
Build Command: npm run build  ❌
Start Command: node server.js  ❌
```

---

## 📋 Environment Variables Checklist

Make sure these are set in Render (Settings → Environment):

```
✅ NODE_ENV = production
✅ PORT = 10000
✅ MONGODB_URI = mongodb+srv://...your-connection-string...
✅ OPENAI_API_KEY = sk-...your-api-key...
✅ OPENAI_MODEL = gpt-4o
✅ OPENAI_MAX_TOKENS = 2000
✅ OPENAI_TEMPERATURE = 0.7
✅ MAX_CRAWL_DEPTH = 3
✅ MAX_PAGES_PER_DOMAIN = 20
✅ CRAWL_TIMEOUT = 10000
```

---

## 🧪 After Deployment - Test These URLs:

1. **Health Check**:
   ```
   https://your-app-name.onrender.com/api/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "message": "FAQForge API is running",
     "timestamp": "2026-01-01T..."
   }
   ```

2. **Websites Endpoint**:
   ```
   https://your-app-name.onrender.com/api/crawl/websites
   ```
   Should return:
   ```json
   {
     "success": true,
     "data": []
   }
   ```

---

## 🐛 Still Not Working? Try This:

### Option A: Delete and Recreate Service
1. Delete the current service on Render
2. Create a new Web Service
3. Connect your GitHub repo
4. Use these EXACT settings:
   - **Name**: faqforge-backend
   - **Root Directory**: [LEAVE EMPTY]
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: main

### Option B: Check Your GitHub Repo
Make sure these files are pushed to GitHub:
```
✅ package.json (with "start": "node backend/server.js")
✅ backend/server.js (the actual server file)
✅ backend/config/database.js
✅ backend/controllers/
✅ backend/models/
✅ backend/routes/
✅ backend/services/
```

Run this to verify:
```bash
git status
git log --oneline -1
```

If files aren't pushed:
```bash
git add .
git commit -m "Fix: Ensure all backend files are committed"
git push origin main
```

---

## 📸 Visual Guide - What Your Render Settings Should Look Like:

### Settings Tab:
```
┌─────────────────────────────────────────┐
│ Build & Deploy                          │
├─────────────────────────────────────────┤
│ Root Directory                          │
│ [                                    ]  │  ← EMPTY!
│                                         │
│ Build Command                           │
│ npm install                             │
│                                         │
│ Start Command                           │
│ npm start                               │
│                                         │
│ [Save Changes]                          │
└─────────────────────────────────────────┘
```

### Environment Tab:
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ NODE_ENV          = production          │
│ PORT              = 10000               │
│ MONGODB_URI       = mongodb+srv://...   │
│ OPENAI_API_KEY    = sk-...              │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 💡 Why This Happens:

Render was looking for:
```
/opt/render/project/src/server.js  ❌ WRONG PATH
```

But your file is actually at:
```
/opt/render/project/backend/server.js  ✅ CORRECT PATH
```

The `npm start` command in package.json correctly points to `backend/server.js`, so once you fix the Root Directory setting, it will work!

---

## 🆘 Need More Help?

If you're still stuck, share:
1. Screenshot of your Render "Settings" page (Build & Deploy section)
2. Screenshot of your Render "Logs" (last 50 lines)
3. Your GitHub repo URL

---

**Follow these steps EXACTLY and your deployment will work! 🚀**
