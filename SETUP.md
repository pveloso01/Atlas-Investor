# Setup Guide

This guide will help you set up the Atlas Investor development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **PostgreSQL 15+** with PostGIS: [Download PostgreSQL](https://www.postgresql.org/download/)
- **Redis 7+**: [Download Redis](https://redis.io/download)
- **Docker & Docker Compose** (recommended): [Download Docker](https://www.docker.com/get-started)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Git Flow** (recommended): See [Git Flow Installation](#git-flow-installation) below

### Verify Installations

```bash
python --version  # Should be 3.11+
node --version    # Should be 18+
psql --version    # Should be 15+
redis-cli --version  # Should be 7+
docker --version
docker-compose --version
git --version
git flow version  # Should show version if installed
```

## Git Flow Installation

This project uses **Git Flow** for branch management. While not strictly required (you can use Git commands manually), Git Flow simplifies the workflow.

### Install Git Flow

**macOS:**
```bash
brew install git-flow-avh
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git-flow
```

**Windows:**
- Git Flow comes with Git for Windows
- Or install [Git Flow AVH Edition](https://github.com/petervanderdoes/gitflow-avh)

**Verify installation:**
```bash
git flow version
```

### Initialize Git Flow

After cloning the repository:

```bash
cd Atlas-Investor
git flow init

# Accept defaults:
# - Production branch: main
# - Development branch: develop
# - Feature prefix: feature/
# - Bugfix prefix: bugfix/
# - Release prefix: release/
# - Hotfix prefix: hotfix/
```

For more information, see the [Git Flow Workflow section in CONTRIBUTING.md](CONTRIBUTING.md#git-flow-workflow).

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/yourusername/Atlas-Investor.git
cd Atlas-Investor

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# (Add API keys, database passwords, etc.)

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access the application
# Backend API: http://localhost:8000
# Frontend: http://localhost:3000
# Admin: http://localhost:8000/admin
```

## Manual Setup

If you prefer to run services manually:

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Atlas-Investor.git
cd Atlas-Investor
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install poetry
poetry install

# Or use pip directly:
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Run database migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata sample_data.json

# Start development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Start development server
npm start
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb atlas_investor

# Enable PostGIS extension
psql -d atlas_investor -c "CREATE EXTENSION postgis;"

# Or using Docker:
docker run --name postgres-atlas \
  -e POSTGRES_DB=atlas_investor \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgis/postgis:15-3.3
```

### 5. Redis Setup

```bash
# Start Redis server
redis-server

# Or using Docker:
docker run --name redis-atlas \
  -p 6379:6379 \
  -d redis:7-alpine
```

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

### Backend `.env`

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/atlas_investor

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# External APIs
MAPBOX_ACCESS_TOKEN=your-mapbox-token
IDEALISTA_API_KEY=your-idealista-key
INE_API_KEY=your-ine-key

# Email (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
```

## Development Tools

### VS Code Setup

Recommended extensions:

- **Python**: Python language support
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Docker**: Docker support
- **PostgreSQL**: Database management
- **GitLens**: Git integration

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

## Running Tests

### Backend Tests

```bash
cd backend
pytest

# With coverage
pytest --cov

# Specific test file
pytest tests/test_analysis.py
```

### Frontend Tests

```bash
cd frontend
npm test

# With coverage
npm test -- --coverage
```

## Common Issues

### Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solution**:
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `createdb atlas_investor`

### PostGIS Extension Error

**Problem**: PostGIS extension not found

**Solution**:
```bash
# Install PostGIS
# On macOS:
brew install postgis
# On Ubuntu:
sudo apt-get install postgis

# Enable extension
psql -d atlas_investor -c "CREATE EXTENSION postgis;"
```

### Redis Connection Error

**Problem**: Cannot connect to Redis

**Solution**:
- Verify Redis is running: `redis-cli ping`
- Check Redis URL in `.env`
- Start Redis: `redis-server`

### Port Already in Use

**Problem**: Port 8000 or 3000 already in use

**Solution**:
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 <PID>

# Or use different port
python manage.py runserver 8001
```

### Module Not Found

**Problem**: Python module not found

**Solution**:
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
poetry install
# or
pip install -r requirements.txt
```

## Next Steps

1. **Read the Documentation**:
   - [Architecture](docs/ARCHITECTURE.md)
   - [Technology Stack](docs/TECHNOLOGY_STACK.md)
   - [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)

2. **Set Up API Keys**:
   - Get Mapbox token: https://account.mapbox.com/
   - Request Idealista API access: https://developers.idealista.com/

3. **Start Developing**:
   - Check out the [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
   - Begin with Phase 1 tasks
   - Follow the [Contributing Guide](CONTRIBUTING.md)

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Docker Documentation](https://docs.docker.com/)

