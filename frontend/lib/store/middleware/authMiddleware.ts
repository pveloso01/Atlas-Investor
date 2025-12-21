/**
 * Auth Middleware for RTK Query
 *
 * Handles 401 (Unauthorized) responses globally by:
 * 1. Clearing the auth token from localStorage
 * 2. Redirecting to the login page
 * 3. Showing a notification to the user
 */

import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import type { MiddlewareAPI } from '@reduxjs/toolkit';

/**
 * Middleware to handle authentication errors (401 responses).
 *
 * When any API call returns a 401 status, this middleware:
 * - Clears the authentication token
 * - Redirects to the login page (client-side only)
 * - Preserves the current URL to redirect back after login
 */
export const authMiddleware: Middleware = () => (next) => (action) => {
  // Check if this is a rejected action with a value (API error)
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number | string } | undefined;
    const status = payload?.status;

    // Handle 401 Unauthorized
    if (status === 401 || status === 'PARSING_ERROR') {
      // Only run on client side
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // Don't redirect from public pages - these should be accessible without auth
        const publicPages = [
          '/pricing',
          '/login',
          '/register',
          '/',
          '/properties',
          '/about',
          '/support',
        ];
        const isPublicPage = publicPages.some(
          (page) => currentPath === page || currentPath.startsWith(page + '/')
        );

        // Only redirect if we're not on a public page
        if (!isPublicPage) {
          // Clear the auth token
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');

          // Store the current URL to redirect back after login
          if (currentPath !== '/login' && currentPath !== '/register') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }

          // Redirect to login page
          window.location.href = '/login';
        }
        // For public pages, just clear invalid tokens but don't redirect
        else if (currentPath === '/login' || currentPath === '/register') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }

    // Handle 403 Forbidden (authenticated but not authorized)
    if (status === 403) {
      console.warn('Access forbidden: You do not have permission to access this resource');
      // Could show a toast notification here
    }
  }

  return next(action);
};
