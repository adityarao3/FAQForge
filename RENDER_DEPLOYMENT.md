# Deploying FAQForge to Render

This guide will help you deploy FAQForge to Render using their Infrastructure as Code (Blueprint) feature.

## Prerequisites

1. A GitHub account with your FAQForge repository
2. A Render account (sign up at https://render.com)
3. MongoDB Atlas database (already configured)
4. OpenAI API key

## Deployment Steps

### Step 1: Push render.yaml to GitHub

The `render.yaml` file has been created in your project root. Commit and push it:

```bash
git add render.yaml RENDER_DEPLOYMENT.md backend/server.js
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create a New Blueprint on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** button in the top right
3. Select **"Blueprint"**
4. Connect your GitHub account if you haven't already
5. Select the **FAQForge** repository
6. Render will automatically detect the `render.yaml` file
7. Click **"Apply"**

### Step 3: Configure Environment Variables

After creating the blueprint, you need to add your sensitive environment variables:

#### For faqforge-backend service:

1. Go to the **faqforge-backend** service in your Render dashboard
2. Navigate to **Environment** tab
3. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `OPENAI_API_KEY`: Your OpenAI API key

The other environment variables are already configured in the `render.yaml` file.

#### For faqforge-frontend service:

The frontend will automatically get the backend URL through the `REACT_APP_API_URL` environment variable, which is configured to use the backend service URL.

### Step 4: Configure Backend Environment Variable (Optional)

To restrict CORS to only your frontend domain:

1. Go to **faqforge-backend** service
2. Add environment variable:
   - `FRONTEND_URL`: `https://faqforge-frontend.onrender.com` (or your custom domain)

### Step 5: Wait for Deployment

Render will:
1. Build and deploy your backend service
2. Build and deploy your frontend static site
3. Both services will be live once the build completes (usually 5-10 minutes)

### Step 6: Access Your Application

Once deployed, you'll get URLs like:
- **Backend API**: `https://faqforge-backend.onrender.com`
- **Frontend**: `https://faqforge-frontend.onrender.com`

The frontend will automatically connect to the backend API.

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free tier services spin down after 15 minutes of inactivity
- **Cold Starts**: First request after spin down will take 30-60 seconds
- **Monthly Hours**: Limited to 750 hours per month for free services

### Environment Variables Security

Never commit `.env` files to GitHub. The `.gitignore` file is already configured to exclude it.

### Database Connection

Ensure your MongoDB Atlas cluster:
- Allows connections from anywhere (0.0.0.0/0) or add Render's IP addresses
- Has the correct database user credentials

### Custom Domains (Optional)

To use custom domains:
1. Go to each service's **Settings** tab
2. Add your custom domain
3. Configure DNS according to Render's instructions

## Updating Your Deployment

To update your deployment:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically redeploy your services when you push to the main branch.

## Troubleshooting

### Backend Not Starting

1. Check environment variables are correctly set
2. View logs in Render dashboard
3. Verify MongoDB connection string is correct

### Frontend Can't Connect to Backend

1. Check `REACT_APP_API_URL` environment variable
2. Verify backend service is running
3. Check CORS configuration in backend

### OpenAI API Errors

1. Verify OpenAI API key is valid
2. Check you have sufficient credits
3. Verify the model name is correct (gpt-4o)

## Monitoring

- View real-time logs in each service's **Logs** tab
- Monitor service health via the **Metrics** tab
- Set up notifications in **Settings** > **Notifications**

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Support: https://www.mongodb.com/docs/atlas/

---

Happy Deploying! 🚀
