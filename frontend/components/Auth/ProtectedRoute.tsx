'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that ensures user is authenticated before rendering children.
 * Prevents flash of content by checking authentication before rendering.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      // Store redirect path before redirecting
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.push('/login');
      return;
    }

    // Token exists, allow rendering
    setIsAuthorized(true);
    setIsChecking(false);
  }, [router]);

  // Show loading spinner while checking authentication
  if (isChecking || !isAuthorized) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return <>{children}</>;
}

