# Railway Deployment Setup Guide

Step-by-step guide to deploy Atlas Investor to Railway.

## Prerequisites

- GitHub account with your repository
- Railway account (sign up at [railway.app](https://railway.app))

---

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended for easy integration)

---

## Step 2: Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"GitHub Repository"** (highlighted option)
3. Authorize Railway to access your GitHub account if prompted
4. Select your `Atlas-Investor` repository
5. Railway will create a new project

---

## Step 3: Add Backend Service

### Option A: Auto-Deploy from GitHub (Recommended)

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select your repository again
3. Railway will detect the `backend/Dockerfile` automatically
4. It will create a service for your backend

### Option B: Manual Setup

1. Click **"New"** → **"Empty Service"**
2. Click on the service → **"Settings"** → **"Source"**
3. Connect to your GitHub repository
4. Set **Root Directory** to `backend`
5. Railway will auto-detect the Dockerfile

---

## Step 4: Configure Environment Variables

Click on your backend service → **"Variables"** tab → Add these:

### Required Variables

```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-here-generate-one
ALLOWED_HOSTS=*.railway.app,your-custom-domain.com
USE_POSTGRES=True

# Database (Railway will provide this automatically if you add PostgreSQL)
# But you can also set manually:
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=railway
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=5432

# CORS (Update with your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app,https://yourusername.github.io

# Optional: External APIs
MAPBOX_ACCESS_TOKEN=your-mapbox-token
IDEALISTA_API_KEY=your-idealista-key
```

### Generate Secret Key

```bash
# Run this locally to generate a secure secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Important:** Railway automatically provides `DATABASE_URL` if you add PostgreSQL service. You can use that instead of individual DB variables.

---

## Step 5: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will create a managed PostgreSQL instance
3. The `DATABASE_URL` environment variable is automatically set
4. Your backend service will automatically connect to it

**Note:** Railway's PostgreSQL includes PostGIS extension, so you can use PostGIS features!

---

## Step 6: Update Settings for Railway

Railway provides `DATABASE_URL` automatically. Update your Django settings to use it:

The current `settings.py` already handles `USE_POSTGRES`, but you may want to also support `DATABASE_URL`:

```python
# In backend/core/settings.py (already handled, but verify)
import os

# Railway provides DATABASE_URL automatically
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES['default'] = dj_database_url.config(conn_max_age=600)
```

**Actually, your current setup should work!** Railway sets `USE_POSTGRES=True` and provides database connection via environment variables.

---

## Step 7: Deploy

1. Railway will automatically deploy when you push to the connected branch
2. Or click **"Deploy"** button to deploy immediately
3. Watch the build logs in real-time
4. Once deployed, Railway provides a URL like: `https://your-app.railway.app`

---

## Step 8: Run Migrations

After first deployment:

1. Click on your backend service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Open **"View Logs"**
5. Or use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run python manage.py migrate

# Create superuser (optional)
railway run python manage.py createsuperuser

# Seed initial data
railway run python manage.py seed_data
```

---

## Step 9: Add Redis (Optional, for Celery/Caching)

1. Click **"New"** → **"Database"** → **"Redis"**
2. Railway creates Redis instance
3. `REDIS_URL` is automatically set
4. Your backend can use it for caching and Celery

---

## Step 10: Configure Custom Domain (Optional)

1. Click on your backend service → **"Settings"** → **"Networking"**
2. Click **"Generate Domain"** or **"Add Custom Domain"**
3. Follow instructions to configure DNS
4. Update `ALLOWED_HOSTS` with your custom domain

---

## Step 11: Update Frontend API URL

Update your frontend to point to Railway backend:

```typescript
// frontend/src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.railway.app/api'  // Your Railway URL
    : 'http://localhost:8000/api');
```

---

## Step 12: Set Up Auto-Deploy

Railway automatically deploys when you push to the connected branch (usually `main`).

To change the branch:
1. Service → **"Settings"** → **"Source"**
2. Select branch (e.g., `main` for production, `develop` for staging)

---

## Step 13: Update GitHub Actions (Optional)

Update `.github/workflows/deploy-production.yml` to work with Railway:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v2.0.4
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend  # Your Railway service name
          # Railway auto-deploys on push, so this is optional
```

**Note:** Railway auto-deploys on push, so GitHub Actions deployment is optional. The CI pipeline (tests) is still valuable!

---

## Monitoring & Logs

### View Logs
1. Click on your service
2. Go to **"Deployments"** tab
3. Click on a deployment → **"View Logs"**

### Metrics
- Railway dashboard shows CPU, Memory, Network usage
- Free tier includes basic metrics

### Health Checks
- Your `/api/health/` endpoint works automatically
- Railway monitors service health

---

## Troubleshooting

### Build Fails

**Issue:** Docker build fails
- Check build logs in Railway
- Verify `Dockerfile` is in `backend/` directory
- Ensure `requirements.txt` is correct

**Issue:** "Module not found"
- Check `requirements.txt` includes all dependencies
- Verify virtual environment isn't being copied

### Deployment Fails

**Issue:** "Database connection failed"
- Verify PostgreSQL service is running
- Check `DATABASE_URL` or database env variables
- Ensure `USE_POSTGRES=True`

**Issue:** "Static files not found"
- Check `collectstatic` runs in Dockerfile
- Verify `STATIC_URL` and `STATIC_ROOT` settings

### Runtime Errors

**Issue:** "500 Internal Server Error"
- Check logs in Railway dashboard
- Verify all environment variables are set
- Check `ALLOWED_HOSTS` includes Railway domain

**Issue:** "CORS errors"
- Update `CORS_ALLOWED_ORIGINS` with frontend URL
- Check frontend is using correct API URL

---

## Cost Estimate

**Railway Pricing:**
- **Free Trial:** $5 credit/month
- **Hobby Plan:** $5/month + usage
- **Pro Plan:** $20/month + usage

**Typical Monthly Cost (MVP):**
- Backend service: ~$5-10/month
- PostgreSQL: ~$5/month
- Redis (optional): ~$5/month
- **Total: ~$10-20/month**

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Test API endpoints
3. ✅ Deploy frontend to GitHub Pages or Vercel
4. ✅ Connect frontend to Railway backend
5. ✅ Set up custom domain (optional)
6. ✅ Configure monitoring and alerts

---

## Quick Reference

### Railway CLI Commands

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run command
railway run python manage.py migrate

# Open shell
railway shell
```

### Useful Railway URLs

- Dashboard: [railway.app/dashboard](https://railway.app/dashboard)
- Docs: [docs.railway.app](https://docs.railway.app)
- Status: [status.railway.app](https://status.railway.app)

---

## Support

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Support: support@railway.app


