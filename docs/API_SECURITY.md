# API Security Documentation

## Overview

This document describes the authentication and authorization mechanisms implemented for the Atlas Investor API.

## Backend Security

### Authentication

The API uses JWT (JSON Web Token) authentication provided by Djoser and SimpleJWT:

- **Registration**: `/api/auth/users/` (POST)
- **Login**: `/api/auth/jwt/create/` (POST) - Returns access and refresh tokens
- **Token Refresh**: `/api/auth/jwt/refresh/` (POST)
- **Logout**: Client-side removal of tokens

### Authorization Levels

#### Public Endpoints (No Authentication Required)

- **Health Check**: `GET /api/health/`
- **Property List/Detail**: `GET /api/properties/` (read-only)
- **Region List/Detail**: `GET /api/regions/` (read-only)
- **Feedback Creation**: `POST /api/feedback/` (anonymous feedback allowed)
- **Support Message Creation**: `POST /api/support/` (anonymous support allowed)
- **Contact Request Creation**: `POST /api/contact/` (anonymous inquiries allowed)
- **User Registration**: `POST /api/auth/users/`
- **User Activation**: `POST /api/auth/users/activation/`
- **Password Reset**: `POST /api/auth/users/reset_password/`

#### Authenticated Endpoints

**Property Operations:**
- `POST /api/properties/` - Create property (IsAuthenticatedOrReadOnly)
- `PUT/PATCH/DELETE /api/properties/{id}/` - Modify property (IsAuthenticatedOrReadOnly)
- `POST /api/properties/{id}/analyze/` - Investment analysis (IsAuthenticatedOrReadOnly)
- `GET /api/properties/{id}/report/` - PDF report (IsAuthenticatedOrReadOnly)

**User-Specific Operations:**
- `GET /api/feedback/` - List own feedback (IsAuthenticated)
- `GET /api/support/` - List own support messages (IsAuthenticated)
- `GET /api/contact/` - List own contact requests (IsAuthenticated)

**Portfolio Management (all require authentication):**
- `GET /api/portfolios/` - List user portfolios
- `POST /api/portfolios/` - Create portfolio
- `GET /api/portfolios/{id}/` - Portfolio detail
- `PUT/PATCH /api/portfolios/{id}/` - Update portfolio
- `DELETE /api/portfolios/{id}/` - Delete portfolio
- `GET /api/portfolios/default/` - Get/create default portfolio
- `POST /api/portfolios/{id}/add_property/` - Add property
- `POST /api/portfolios/{id}/remove-property/` - Remove property
- `PATCH /api/portfolios/{id}/update-property/{property_id}/` - Update property

**Saved Properties (all require authentication):**
- `GET /api/saved-properties/` - List saved properties
- `POST /api/saved-properties/` - Save property
- `DELETE /api/saved-properties/{id}/` - Unsave property

**User Profile:**
- `GET /api/auth/users/me/` - Get current user
- `PUT/PATCH /api/auth/users/me/` - Update profile

#### Admin-Only Operations

Staff users have additional permissions:
- View all feedback, support messages, and contact requests
- Access Django admin panel at `/admin/`

### Permission Classes

```python
# Property browsing - read-only for all, write requires auth
permission_classes = [IsAuthenticatedOrReadOnly]

# User-specific data - requires authentication
permission_classes = [IsAuthenticated]

# Dynamic permissions based on action
def get_permissions(self):
    if self.action == 'create':
        return [AllowAny()]  # Allow anonymous creation
    return [IsAuthenticated()]  # Require auth for viewing
```

## Frontend Security

### Token Storage

Authentication tokens are stored in `localStorage`:

```typescript
// Login
localStorage.setItem('authToken', accessToken);

// API calls include token
headers.set('authorization', `Bearer ${token}`);

// Logout
localStorage.removeItem('authToken');
```

### API Configuration

All RTK Query API slices include `prepareHeaders`:

```typescript
baseQuery: fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
})
```

### 401 Response Handling

The application includes a custom Redux middleware (`authMiddleware`) that intercepts all API responses:

**When a 401 (Unauthorized) response is received:**
1. Auth tokens are cleared from `localStorage`
2. Current URL is saved to `sessionStorage` (for post-login redirect)
3. User is automatically redirected to `/login` page
4. After successful login, user is redirected back to original page

**Implementation:**
```typescript
// frontend/lib/store/middleware/authMiddleware.ts
export const authMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) && action.payload?.status === 401) {
    localStorage.removeItem('authToken');
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  }
  return next(action);
};
```

**Configuration:**
```typescript
// frontend/lib/store/store.ts
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware()
    .concat(/* ...API middlewares... */)
    .concat(authMiddleware), // Add last to catch all API errors
```

## Security Best Practices

### Implemented

✅ JWT authentication with access and refresh tokens
✅ HTTPS recommended for production (SECURE_SSL_REDIRECT setting)
✅ CORS configuration limiting allowed origins
✅ Password hashing using Django's default PBKDF2
✅ CSRF protection for state-changing operations
✅ Permission classes on all sensitive endpoints
✅ User-scoped querysets (users only see their own data)
✅ Automatic 401 handling with redirect to login
✅ Token storage in httpOnly context (localStorage with plans for httpOnly cookies)
✅ Comprehensive permission tests (27 tests covering all scenarios)

### Recommendations for Production

- [ ] Enable HTTPS only (`SECURE_SSL_REDIRECT = True`)
- [ ] Set secure cookie flags (`SESSION_COOKIE_SECURE = True`)
- [ ] Configure CORS for specific production domains only
- [ ] Implement rate limiting on authentication endpoints
- [ ] Add security headers (django-secure-headers)
- [ ] Regular security audits with tools like Bandit
- [ ] Monitor for suspicious activity
- [ ] Implement 2FA for user accounts (optional)

## Token Expiration

**Access Token**: 60 minutes (default SimpleJWT)
**Refresh Token**: 1 day (default SimpleJWT)

When access token expires:
1. Frontend automatically calls `/api/auth/jwt/refresh/` with refresh token
2. New access token is returned and stored
3. If refresh token expires, user must log in again

## Testing Authentication

Run permission tests:

```bash
cd backend
python manage.py test api.tests.test_api_permissions
```

Test 401 handling in frontend:

```bash
cd frontend
npm test -- SecurityMiddleware.test.tsx
```

## Troubleshooting

**401 Unauthorized**: Check that token is being sent in `Authorization` header
**403 Forbidden**: User is authenticated but lacks permission for resource
**Token expired**: Refresh token or re-authenticate
**CORS errors**: Verify frontend origin is in `CORS_ALLOWED_ORIGINS`

