'use client';

import React, { useState } from 'react';
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
import { useRegisterMutation } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.re_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(formData).unwrap();
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { data?: { email?: string[]; password?: string[] } };
      if (error.data?.email) {
        setError(error.data.email[0]);
      } else if (error.data?.password) {
        setError(error.data.password[0]);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Registration Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please check your email to activate your account.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/login')}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Create Account
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: colors.neutral.gray600 }}>
          Join Atlas Investor to discover investment opportunities
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Box>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            sx={{ mb: 2 }}
            helperText="At least 8 characters"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="re_password"
            type="password"
            value={formData.re_password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" sx={{ color: colors.primary.main }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

