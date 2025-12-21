'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLoginMutation } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Handle redirect after successful login
      if (typeof window !== 'undefined') {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
        } else {
          // Default redirect to dashboard or home
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      const error = err as { 
        status?: number | string;
        data?: { error?: string; detail?: string };
      };
      
      // Handle different error status codes
      if (error.status === 400) {
        setError(error.data?.error || 'Email and password are required.');
      } else if (error.status === 401) {
        setError('Invalid email or password.');
      } else if (error.status === 403) {
        setError('Account is not active. Please activate your account first.');
      } else if (error.status === 423) {
        setError('Account is temporarily locked. Please try again later.');
      } else if (error.data?.error) {
        setError(error.data.error);
      } else if (error.data?.detail) {
        setError(error.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Sign In
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: colors.neutral.gray600 }}>
          Welcome back to Atlas Investor
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 3, textAlign: 'right' }}>
            <Link 
              href="/password-reset" 
              sx={{ 
                color: colors.primary.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link href="/register" sx={{ color: colors.primary.main }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
