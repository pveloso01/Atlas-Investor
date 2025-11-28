# Railway Quick Start Guide

**5-minute setup to deploy Atlas Investor to Railway**

## Step-by-Step Instructions

### 1. Sign Up & Create Project

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"**
3. Select **"GitHub Repository"** (the highlighted option you see)
4. Authorize Railway → Select `Atlas-Investor` repository
5. Railway creates your project automatically

### 2. Add Backend Service

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select your `Atlas-Investor` repository
3. Railway will detect `backend/Dockerfile` automatically
4. Set **Root Directory** to `backend` (if not auto-detected)
5. Click **"Deploy"**

### 3. Add PostgreSQL Database

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway creates PostgreSQL with PostGIS automatically
3. The `DATABASE_URL` environment variable is set automatically
4. Your backend will connect to it automatically

### 4. Configure Environment Variables

Click on your backend service → **"Variables"** tab → Add:

```bash
DEBUG=False
SECRET_KEY=<generate-one-below>
ALLOWED_HOSTS=*.railway.app
USE_POSTGRES=True
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

**Generate Secret Key:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Deploy!

Railway automatically deploys when you:
- Push to the connected branch (usually `main`)
- Or click **"Deploy"** button

Watch the build logs in real-time!

### 6. Run Migrations

After first deployment, run migrations:

**Option A: Railway Dashboard**
1. Click on backend service → **"Deployments"** → Latest deployment
2. Click **"View Logs"** → Open terminal
3. Run: `python manage.py migrate`

**Option B: Railway CLI**
```bash
npm i -g @railway/cli
railway login
railway link
railway run python manage.py migrate
railway run python manage.py seed_data
```

### 7. Get Your URL

1. Click on backend service → **"Settings"** → **"Networking"**
2. Railway provides: `https://your-app.railway.app`
3. Test: `https://your-app.railway.app/api/health/`

### 8. Update Frontend

Update `frontend/src/services/api.ts`:

```typescript
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-app.railway.app/api'  // Your Railway URL
    : 'http://localhost:8000/api');
```

---

## That's It! 🎉

Your backend is now live on Railway!

**Next Steps:**
- Deploy frontend to GitHub Pages or Vercel
- Connect frontend to Railway backend
- Set up custom domain (optional)

---

## Troubleshooting

**Build fails?**
- Check logs in Railway dashboard
- Verify `Dockerfile` exists in `backend/` directory

**Database connection fails?**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is set (Railway sets this automatically)

**500 errors?**
- Check `ALLOWED_HOSTS` includes `*.railway.app`
- Verify `SECRET_KEY` is set
- Check logs for specific errors

---

## Cost

- **Free Trial:** $5 credit/month
- **Typical Cost:** ~$10-20/month for backend + database

---

## Need Help?

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

