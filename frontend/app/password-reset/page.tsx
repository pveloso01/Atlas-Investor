'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useRequestPasswordResetMutation } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

export default function PasswordResetPage() {
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await requestReset({ email }).unwrap();
      setSuccess(true);
    } catch {
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Email Sent!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            If an account exists with that email, you will receive a password reset link shortly.
          </Typography>
          <Link href="/login" sx={{ color: colors.primary.main }}>
            Return to Login
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Reset Password
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: colors.neutral.gray600 }}>
          Enter your email to receive a password reset link
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/login" sx={{ color: colors.primary.main }}>
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

