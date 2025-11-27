# Deployment Strategy

This document outlines the deployment strategy for Atlas Investor across different environments.

## Deployment Environments

### Development
- **Purpose**: Local development
- **Location**: Developer machines
- **Setup**: Docker Compose
- **Database**: Local PostgreSQL
- **Cache**: Local Redis
- **Features**: Hot reload, debugging tools

### Staging
- **Purpose**: Pre-production testing
- **Location**: Cloud server
- **Setup**: Mirrors production
- **Database**: Managed PostgreSQL
- **Cache**: Managed Redis
- **Features**: Full production-like environment

### Production
- **Purpose**: Live application
- **Location**: Cloud infrastructure
- **Setup**: Optimized for performance and reliability
- **Database**: Managed PostgreSQL with backups
- **Cache**: Managed Redis cluster
- **Features**: Monitoring, logging, alerts

## Development Environment Setup

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: atlas_investor
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/atlas_investor
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    command: npm start
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

### Local Setup

```bash
# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access services
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# Database: localhost:5432
# Redis: localhost:6379
```

## Staging Environment

### Infrastructure

**Initial Setup:**
- Single cloud server (DigitalOcean Droplet or AWS EC2)
- Managed PostgreSQL database
- Managed Redis instance
- Domain name with SSL

**Server Specifications:**
- 2 CPU cores
- 4GB RAM
- 40GB SSD
- Ubuntu 22.04 LTS

### Deployment Process

1. **Build Application**
   ```bash
   # Build Docker images
   docker build -t atlas-investor-backend ./backend
   docker build -t atlas-investor-frontend ./frontend
   ```

2. **Push to Registry**
   ```bash
   # Tag and push images
   docker tag atlas-investor-backend registry.example.com/atlas-backend:latest
   docker push registry.example.com/atlas-backend:latest
   ```

3. **Deploy to Server**
   ```bash
   # SSH to server
   ssh user@staging.example.com
   
   # Pull latest images
   docker-compose pull
   
   # Restart services
   docker-compose up -d
   
   # Run migrations
   docker-compose exec backend python manage.py migrate
   ```

### Environment Variables

```bash
# .env.staging
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@db-host:5432/atlas_investor
REDIS_URL=redis://redis-host:6379/0
ALLOWED_HOSTS=staging.example.com
CORS_ALLOWED_ORIGINS=https://staging.example.com
MAPBOX_ACCESS_TOKEN=your-mapbox-token
IDEALISTA_API_KEY=your-api-key
```

## Production Environment

### Infrastructure (Initial)

**Single Server Setup:**
- Cloud server (DigitalOcean/AWS EC2)
- Managed PostgreSQL (RDS/DigitalOcean)
- Managed Redis
- CDN for static assets (CloudFront/Cloudflare)
- SSL certificates (Let's Encrypt)

**Server Specifications:**
- 4 CPU cores
- 8GB RAM
- 80GB SSD
- Ubuntu 22.04 LTS

### Infrastructure (Scaled)

**Multi-Server Setup:**
- Load balancer (AWS ALB/DigitalOcean)
- Multiple application servers (auto-scaling)
- Database read replicas
- Redis cluster
- CDN with edge caching
- Monitoring and logging services

### Deployment Architecture

```
                    ┌─────────────┐
                    │   CDN       │
                    │ (Static)    │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────┴────┐                          ┌─────┴─────┐
   │  App    │                          │    App    │
   │ Server  │                          │   Server  │
   │   1     │                          │     2     │
   └────┬────┘                          └─────┬─────┘
        │                                     │
        └──────────────┬──────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────┴────┐                  ┌─────┴─────┐
   │   DB    │                  │   Redis   │
   │ Primary │                  │  Cluster  │
   └────┬────┘                  └───────────┘
        │
   ┌────┴────┐
   │   DB    │
   │ Replica │
   └─────────┘
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
      - staging

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          # Backend tests
          cd backend && pytest
          # Frontend tests
          cd frontend && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t atlas-backend ./backend
          docker build -t atlas-frontend ./frontend

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@master
        with:
          host: staging.example.com
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/atlas-investor
            docker-compose pull
            docker-compose up -d
            docker-compose exec backend python manage.py migrate

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: production.example.com
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/atlas-investor
            docker-compose pull
            docker-compose up -d
            docker-compose exec backend python manage.py migrate
```

### Deployment Process

1. **Code Push**
   - Developer pushes to `main` or `staging` branch
   - GitHub Actions triggers

2. **Automated Testing**
   - Run all tests
   - Check code coverage
   - Lint and format checks

3. **Build**
   - Build Docker images
   - Tag with version/commit SHA
   - Push to container registry

4. **Deploy**
   - Deploy to staging (on `staging` branch)
   - Manual approval for production
   - Deploy to production (on `main` branch)

5. **Post-Deployment**
   - Run database migrations
   - Health checks
   - Smoke tests
   - Monitor for errors

## Database Migrations

### Migration Strategy

**Development:**
```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate
```

**Staging/Production:**
```bash
# Backup database first
pg_dump atlas_investor > backup.sql

# Apply migrations
python manage.py migrate

# Verify
python manage.py showmigrations
```

### Rollback Plan

1. **Database Rollback**
   ```bash
   # Restore from backup
   psql atlas_investor < backup.sql
   
   # Or rollback specific migration
   python manage.py migrate app_name previous_migration
   ```

2. **Application Rollback**
   ```bash
   # Revert to previous Docker image
   docker-compose pull
   docker tag registry.example.com/atlas-backend:previous registry.example.com/atlas-backend:latest
   docker-compose up -d
   ```

## Environment Configuration

### Configuration Management

**Secrets:**
- Store in environment variables
- Use secret management service (AWS Secrets Manager, HashiCorp Vault)
- Never commit secrets to repository
- Rotate secrets regularly

**Configuration Files:**
- `.env.development` (local)
- `.env.staging` (staging)
- `.env.production` (production)

### Required Environment Variables

```bash
# Django
DEBUG=False
SECRET_KEY=...
ALLOWED_HOSTS=...
DATABASE_URL=...
REDIS_URL=...

# CORS
CORS_ALLOWED_ORIGINS=...

# External APIs
MAPBOX_ACCESS_TOKEN=...
IDEALISTA_API_KEY=...
INE_API_KEY=...

# Email
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASSWORD=...

# Monitoring
SENTRY_DSN=...
```

## Monitoring & Logging

### Application Monitoring

**Sentry:**
- Error tracking
- Performance monitoring
- Release tracking
- User feedback

**Application Logs:**
- Structured logging (JSON format)
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Log aggregation (ELK stack, CloudWatch)

### Infrastructure Monitoring

**Prometheus + Grafana:**
- System metrics (CPU, memory, disk)
- Application metrics (request rate, response time)
- Database metrics
- Custom business metrics

**Alerts:**
- High error rate
- Slow response times
- Database connection issues
- Disk space warnings
- Memory usage

### Health Checks

**Endpoint:** `/health/`

**Checks:**
- Database connectivity
- Redis connectivity
- External API availability
- Disk space
- Memory usage

```python
# backend/api/views/health.py
from django.http import JsonResponse
from django.db import connection
import redis

def health_check(request):
    checks = {
        'status': 'healthy',
        'database': check_database(),
        'redis': check_redis(),
    }
    
    if any(not v for v in checks.values() if v != 'status'):
        checks['status'] = 'unhealthy'
        return JsonResponse(checks, status=503)
    
    return JsonResponse(checks)
```

## Backup & Recovery

### Database Backups

**Automated Backups:**
- Daily full backups
- Weekly backups retained for 4 weeks
- Monthly backups retained for 12 months
- Test restore procedures monthly

**Backup Storage:**
- Encrypted backups
- Stored in separate location (S3, separate server)
- Versioned backups

### Disaster Recovery Plan

1. **Identify Issue**
   - Monitor alerts
   - Verify problem
   - Assess impact

2. **Containment**
   - Isolate affected systems
   - Prevent data loss
   - Maintain service if possible

3. **Recovery**
   - Restore from backup
   - Verify data integrity
   - Resume service

4. **Post-Mortem**
   - Document incident
   - Identify root cause
   - Implement prevention measures

## Security

### SSL/TLS

- HTTPS everywhere
- Let's Encrypt certificates
- Auto-renewal
- HSTS headers

### Firewall

- Restrict SSH access
- Allow only necessary ports
- Use security groups (AWS) or firewall rules

### Updates

- Regular security updates
- Automated patch management
- Monitor for vulnerabilities
- Update dependencies regularly

## Scaling Strategy

### Horizontal Scaling

**Application Servers:**
- Add more servers behind load balancer
- Stateless application design
- Session storage in Redis

**Database:**
- Read replicas for read-heavy workloads
- Connection pooling
- Query optimization

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Upgrade database instance
- Optimize application code

### Auto-Scaling

**Triggers:**
- CPU usage > 70%
- Memory usage > 80%
- Request queue length

**Actions:**
- Add servers when scaling up
- Remove servers when scaling down
- Cooldown periods to prevent thrashing

## Cost Optimization

### Initial Setup (MVP)
- Single server: ~$40-80/month
- Managed database: ~$15-30/month
- Managed Redis: ~$10-20/month
- CDN: ~$5-10/month
- **Total: ~$70-140/month**

### Scaled Setup
- Multiple servers: ~$200-400/month
- Database cluster: ~$100-200/month
- Redis cluster: ~$50-100/month
- CDN: ~$20-50/month
- Monitoring: ~$20-50/month
- **Total: ~$390-800/month**

### Optimization Tips
- Use reserved instances for predictable workloads
- Right-size instances
- Optimize database queries
- Implement caching effectively
- Use CDN for static assets
- Monitor and optimize costs regularly

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets updated
- [ ] Backup created

### Deployment
- [ ] Deploy to staging first
- [ ] Verify staging deployment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor for errors

### Post-Deployment
- [ ] Verify health checks
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Verify database migrations
- [ ] Test critical user flows
- [ ] Update documentation if needed

