# Deploying FAQForge to Vercel

This guide will help you deploy FAQForge to Vercel, with the frontend and backend API running together.

## Prerequisites

1. A GitHub account with your FAQForge repository
2. A Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas database (already configured)
4. OpenAI API key

## Deployment Methods

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **FAQForge** repository
4. Vercel will automatically detect it as a Node.js project

#### Step 2: Configure Project

In the project configuration screen:

**Framework Preset:** `Other`

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (leave as default)

**Output Directory:** `frontend/build`

**Install Command:** `npm install`

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |
| `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-4o` | Production, Preview, Development |
| `OPENAI_MAX_TOKENS` | `2000` | Production, Preview, Development |
| `OPENAI_TEMPERATURE` | `0.7` | Production, Preview, Development |
| `MAX_CRAWL_DEPTH` | `3` | Production, Preview, Development |
| `MAX_PAGES_PER_DOMAIN` | `20` | Production, Preview, Development |
| `CRAWL_TIMEOUT` | `10000` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

Your MongoDB URI:
```
mongodb+srv://adityarao9541_db_user:r6J92ZMPBdHW0dnc@cluster0.vakomq9.mongodb.net/?appName=Cluster0
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy

```bash
# From your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? faqforge (or your choice)
# - Directory? ./ (default)
# - Override settings? No
```

#### Add Environment Variables via CLI

```bash
vercel env add MONGODB_URI
vercel env add OPENAI_API_KEY
vercel env add OPENAI_MODEL
vercel env add NODE_ENV
# ... add all other variables
```

#### Deploy to Production

```bash
vercel --prod
```

## Project Structure

The deployment uses the following structure:

```
FAQForge/
├── api/
│   └── index.js          # Vercel serverless function entry
├── backend/
│   ├── server.js         # Express app (exported for Vercel)
│   └── ...               # Other backend files
├── frontend/
│   ├── build/            # Built React app (generated)
│   └── ...
├── vercel.json           # Vercel configuration
└── package.json
```

## How It Works

1. **Frontend**: React app is built and served as static files from `/frontend/build`
2. **Backend API**: Express server runs as serverless functions under `/api` routes
3. **Routing**: 
   - `/api/*` → Backend API
   - `/*` → Frontend React app

## Accessing Your Application

After deployment, you'll get a URL like:
- **Production**: `https://faqforge.vercel.app`
- **API Endpoint**: `https://faqforge.vercel.app/api/health`

## Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificates

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

- **Main branch** → Production deployment
- **Other branches** → Preview deployments

## Environment Variables Management

### View All Variables
```bash
vercel env ls
```

### Add a Variable
```bash
vercel env add VARIABLE_NAME
```

### Remove a Variable
```bash
vercel env rm VARIABLE_NAME
```

### Pull Environment Variables Locally
```bash
vercel env pull .env.local
```

## Troubleshooting

### Backend API Not Working

1. Check environment variables in Vercel dashboard
2. View function logs: **Vercel Dashboard** → **Your Project** → **Functions** tab
3. Ensure MongoDB allows connections from anywhere (0.0.0.0/0)

### Frontend Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all frontend dependencies are in `frontend/package.json`
3. Verify the build command works locally: `cd frontend && npm run build`

### CORS Issues

The backend is already configured with CORS. If you need to restrict it:
1. Add `FRONTEND_URL` environment variable with your Vercel domain
2. The backend will use it automatically

### MongoDB Connection Issues

1. Verify MongoDB Atlas allows connections from 0.0.0.0/0
2. Check if IP whitelist needs updating
3. Verify credentials in connection string

### Serverless Function Timeout

Vercel free tier has a 10-second function execution limit. For longer operations:
1. Upgrade to Pro plan (60-second timeout)
2. Or optimize your crawling/FAQ generation logic

## Monitoring and Logs

### View Logs
- **Dashboard**: Go to your project → **Deployments** → Select deployment → **Function Logs**
- **CLI**: `vercel logs`

### Real-time Logs
```bash
vercel logs --follow
```

### Analytics
- Go to **Vercel Dashboard** → **Your Project** → **Analytics**
- View page views, performance metrics, and more

## Performance Optimization

### Edge Caching
Vercel automatically caches static assets. Configure cache headers if needed in `vercel.json`.

### Serverless Function Regions
By default, functions deploy to all regions. To optimize:
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## Vercel Limits (Hobby/Free Tier)

- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-hours
- **Function Duration**: 10 seconds max
- **Deployments**: Unlimited
- **Team Members**: 1 (you)

## Rolling Back

If a deployment has issues:

1. Go to **Vercel Dashboard** → **Deployments**
2. Find a working deployment
3. Click the three dots → **Promote to Production**

Or via CLI:
```bash
vercel rollback
```

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Vercel Support**: https://vercel.com/support

## Cleanup

To remove the deployment:

```bash
vercel remove faqforge
```

Or delete from the Vercel dashboard.

---

Happy Deploying! 🚀

Your app will be live at: `https://your-project-name.vercel.app`
