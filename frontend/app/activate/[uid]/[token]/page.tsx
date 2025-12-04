'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Email } from '@mui/icons-material';
import { useActivateAccountMutation } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

export default function ActivateAccountPage() {
  const params = useParams();
  const router = useRouter();
  const [activateAccount, { isLoading }] = useActivateAccountMutation();
  
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const uid = params.uid as string;
  const token = params.token as string;

  useEffect(() => {
    const activate = async () => {
      if (!uid || !token) {
        setStatus('error');
        setErrorMessage('Invalid activation link.');
        return;
      }

      try {
        await activateAccount({ uid, token }).unwrap();
        setStatus('success');
      } catch (err: unknown) {
        setStatus('error');
        const error = err as { data?: { detail?: string; uid?: string[]; token?: string[] } };
        if (error.data?.detail) {
          setErrorMessage(error.data.detail);
        } else if (error.data?.uid) {
          setErrorMessage('Invalid activation link.');
        } else if (error.data?.token) {
          setErrorMessage('This activation link has expired or is invalid.');
        } else {
          setErrorMessage('Account activation failed. Please try again or contact support.');
        }
      }
    };

    activate();
  }, [uid, token, activateAccount]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {isLoading || status === 'pending' ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Activating Your Account
            </Typography>
            <Typography variant="body1" sx={{ color: colors.neutral.gray600 }}>
              Please wait while we verify your email...
            </Typography>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle sx={{ fontSize: 80, color: colors.success.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: colors.success.main }}>
              Account Activated!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: colors.neutral.gray600 }}>
              Your email has been verified and your account is now active.
              You can now sign in to access all features.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/login')}
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: colors.primary.main,
                '&:hover': { backgroundColor: colors.primary.dark },
              }}
            >
              Sign In Now
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: colors.error.main, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: colors.error.main }}>
              Activation Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {errorMessage}
            </Alert>
            <Typography variant="body2" sx={{ mb: 3, color: colors.neutral.gray600 }}>
              If you continue to have issues, please try registering again or contact our support team.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/register')}
              >
                Register Again
              </Button>
              <Button
                variant="contained"
                startIcon={<Email />}
                onClick={() => window.location.href = 'mailto:support@atlasinvestor.com'}
                sx={{
                  backgroundColor: colors.primary.main,
                  '&:hover': { backgroundColor: colors.primary.dark },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Additional Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: colors.neutral.gray500 }}>
          Need help?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => router.push('/')}
            sx={{ color: colors.primary.main, textTransform: 'none' }}
          >
            Return to Home
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

