# GitHub-Based Deployment Guide

This guide explains how to set up CI/CD using GitHub Actions and deploy Atlas Investor.

## Overview

**Recommended Architecture:**
- **Frontend**: GitHub Pages (free) or Vercel/Netlify (free tier)
- **Backend**: Render, DigitalOcean, or AWS (paid, but affordable)
- **Database**: Managed PostgreSQL (included with hosting or separate)
- **CI/CD**: GitHub Actions (free for public repos)

## Why Not GitHub Pages for Everything?

**GitHub Pages Limitations:**
- ✅ **Frontend**: Perfect! React builds to static files
- ❌ **Backend**: Cannot run Django/Python servers
- ❌ **Database**: No database support
- ❌ **Server-side logic**: No API endpoints

**Solution**: Use GitHub Pages for frontend, separate hosting for backend.

---

## Option 1: GitHub Pages (Frontend) + Render/DigitalOcean (Backend)

### Frontend: GitHub Pages

**Pros:**
- Free for public repos
- Automatic HTTPS
- Custom domain support
- Automatic deployments on push to main

**Setup Steps:**

1. **Build Configuration**
   ```json
   // frontend/package.json
   {
     "homepage": "https://yourusername.github.io/Atlas-Investor",
     "scripts": {
       "build": "react-scripts build",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Update API URL for Production**
   ```typescript
   // frontend/src/services/api.ts
   const API_URL = process.env.REACT_APP_API_URL || 
     (process.env.NODE_ENV === 'production' 
       ? 'https://your-backend.render.com/api'  // Production backend
       : 'http://localhost:8000/api');            // Development
   ```

4. **GitHub Pages Workflow**
   Create `.github/workflows/deploy-frontend.yml`:
   ```yaml
   name: Deploy Frontend to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v4
           with:
             node-version: '18'
         - run: cd frontend && npm ci && npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend/build
   ```

### Backend: Render or DigitalOcean

**Render** (Recommended for simplicity):
- Free tier available (with limitations)
- Automatic deployments from GitHub
- Built-in PostgreSQL
- Easy environment variables

**DigitalOcean** (Alternative):
- More control and flexibility
- $6-12/month for basic droplet
- Manual setup required

**Setup Steps:**

1. **Create Dockerfile for Production**
   ```dockerfile
   # backend/Dockerfile.prod
   FROM python:3.12-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   RUN python manage.py collectstatic --noinput
   
   CMD gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
   ```

2. **Deploy to Render:**
   - Connect GitHub repo
   - Render auto-detects Dockerfile
   - Add environment variables
   - Deploy!

---

## Option 2: Full Server Deployment (DigitalOcean/AWS)

### Architecture

```
GitHub → GitHub Actions → Build & Test → Deploy to Server
```

### Setup Steps

1. **Create Deployment Server**
   - DigitalOcean Droplet ($6-12/month)
   - AWS EC2 t3.micro (free tier eligible)
   - Ubuntu 22.04 LTS

2. **Server Setup Script**
   ```bash
   #!/bin/bash
   # setup-server.sh
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Create deployment user
   sudo useradd -m -s /bin/bash deploy
   sudo usermod -aG docker deploy
   
   # Setup application directory
   sudo mkdir -p /opt/atlas-investor
   sudo chown deploy:deploy /opt/atlas-investor
   ```

3. **Configure GitHub Actions Deployment**

   Update `.github/workflows/deploy-production.yml`:
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
         
         - name: Deploy via SSH
           uses: appleboy/ssh-action@v1.0.0
           with:
             host: ${{ secrets.PRODUCTION_HOST }}
             username: ${{ secrets.PRODUCTION_USER }}
             key: ${{ secrets.PRODUCTION_SSH_KEY }}
             script: |
               cd /opt/atlas-investor
               git pull origin main
               docker-compose -f docker-compose.prod.yml pull
               docker-compose -f docker-compose.prod.yml up -d --build
               docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate
   ```

4. **Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   
   services:
     backend:
       image: your-registry/atlas-backend:latest
       restart: always
       environment:
         - DEBUG=False
         - SECRET_KEY=${SECRET_KEY}
         - DATABASE_URL=${DATABASE_URL}
       ports:
         - "8000:8000"
     
     frontend:
       image: nginx:alpine
       volumes:
         - ./frontend/build:/usr/share/nginx/html
       ports:
         - "80:80"
         - "443:443"
   ```

---

## CI/CD Pipeline Flow

### Branch Strategy

```
feature/* → develop → main
           ↓         ↓
        Staging   Production
```

### Workflow

1. **Feature Branch**
   - Developer creates feature branch
   - Pushes code
   - Opens PR

2. **Pull Request**
   - CI pipeline runs (tests, linting)
   - Code review
   - Merge to `develop`

3. **Develop Branch (Staging)**
   - CI pipeline runs
   - Auto-deploy to staging
   - Manual testing

4. **Main Branch (Production)**
   - CI pipeline runs
   - Manual approval (optional)
   - Auto-deploy to production
   - Health checks

---

## GitHub Actions Setup

### Required Secrets

**For Staging/Production Deployment:**
- `PRODUCTION_HOST`: Server IP or domain
- `PRODUCTION_USER`: SSH username
- `PRODUCTION_SSH_KEY`: Private SSH key
- `PRODUCTION_DATABASE_URL`: PostgreSQL connection string
- `PRODUCTION_SECRET_KEY`: Django secret key

**For Render:**
- `RENDER_API_KEY`: Render API key (if using Render API)

### Setting Up Secrets

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

---

## Recommended Setup for Your Project

### Phase 1: MVP (Free/Low Cost)

**Frontend:**
- GitHub Pages (free)
- Custom domain: $10-15/year

**Backend:**
- Render (free tier with limitations)
- Or DigitalOcean Droplet ($6/month)

**Database:**
- Included with Render
- Or Supabase (free tier)

**Total Cost: ~$0-10/month**

### Phase 2: Growth (Paid)

**Frontend:**
- Vercel or Netlify (free tier, better features)
- Or keep GitHub Pages

**Backend:**
- Render ($7-25/month)
- Or DigitalOcean Droplet ($12/month)

**Database:**
- Managed PostgreSQL ($15-30/month)

**Total Cost: ~$30-50/month**

### Phase 3: Scale (Production)

**Frontend:**
- CDN (Cloudflare, free)
- Vercel Pro or Netlify Pro

**Backend:**
- Multiple servers with load balancer
- Auto-scaling

**Database:**
- Managed PostgreSQL cluster
- Read replicas

**Total Cost: ~$100-300/month**

---

## Quick Start: Render Deployment

1. **Sign up at render.com**
2. **Create new web service**
3. **Connect GitHub repo**
4. **Select backend directory**
5. **Add environment variables:**
   ```
   USE_POSTGRES=True
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-app.onrender.com
   ```
6. **Render auto-deploys on push to main!**

---

## Next Steps

1. **Choose hosting option** (Render recommended for start)
2. **Set up GitHub Actions** (workflows already created)
3. **Configure secrets** in GitHub
4. **Test deployment** to staging first
5. **Deploy to production** when ready

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Render Docs](https://render.com/docs)
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)


