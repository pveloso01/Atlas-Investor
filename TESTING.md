# Testing Guide

Quick guide to test the current setup.

## Backend Testing

### 1. Run Django Development Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

**Expected**: Server starts on `http://127.0.0.1:8000/`

### 2. Test Health Check Endpoint

```bash
# In another terminal
curl http://127.0.0.1:8000/api/health/

# Or use browser: http://127.0.0.1:8000/api/health/
```

**Expected Response**:
```json
{
  "status": "healthy",
  "message": "Atlas Investor API is running",
  "version": "0.1.0"
}
```

### 3. Test Django Admin

```bash
# Create superuser
python manage.py createsuperuser

# Visit: http://127.0.0.1:8000/admin/
```

### 4. Run Django Checks

```bash
python manage.py check
```

**Expected**: `System check identified no issues (0 silenced).`

## Frontend Testing

### 1. Start React Development Server

```bash
cd frontend
npm start
```

**Expected**: 
- Browser opens automatically at `http://localhost:3000`
- React logo and "Learn React" message appears

### 2. Test API Connection

Edit `frontend/src/App.tsx` to test API:

```typescript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/health/')
      .then(response => setHealth(response.data))
      .catch(error => console.error('API Error:', error));
  }, []);

  return (
    <div>
      <h1>Atlas Investor</h1>
      {health ? (
        <div>
          <p>Status: {health.status}</p>
          <p>Message: {health.message}</p>
        </div>
      ) : (
        <p>Connecting to API...</p>
      )}
    </div>
  );
}

export default App;
```

**Expected**: Frontend displays API health status.

### 3. Run Frontend Tests

```bash
cd frontend
npm test
```

**Expected**: Tests pass (or skip if no tests written yet).

## Docker Testing (Optional)

### 1. Start All Services

```bash
# From project root
docker-compose up -d
```

**Note**: Dockerfiles need to be created first. This is for future use.

### 2. Check Services

```bash
docker-compose ps
```

## Quick Test Script

Create a simple test script:

```bash
#!/bin/bash
# test.sh

echo "Testing Backend..."
cd backend
source venv/bin/activate
python manage.py check && echo "✓ Django check passed"
python manage.py migrate && echo "✓ Migrations applied"

echo ""
echo "Testing Frontend..."
cd ../frontend
npm run build && echo "✓ Frontend builds successfully"

echo ""
echo "All tests passed!"
```

## Manual Testing Checklist

- [ ] Backend server starts without errors
- [ ] Health check endpoint returns JSON
- [ ] Django admin accessible
- [ ] Frontend server starts
- [ ] React app loads in browser
- [ ] CORS allows frontend to call backend API
- [ ] No console errors in browser

## Next Steps

Once basic tests pass:
1. Add unit tests for backend
2. Add component tests for frontend
3. Set up CI/CD for automated testing
4. Add integration tests

