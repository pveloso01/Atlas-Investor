'use client';

import React from 'react';
import { Alert, AlertTitle, Box, Button, Paper, Typography } from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ErrorMessageProps {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message or description
   */
  message?: string;
  /**
   * Error object (for development)
   */
  error?: Error | unknown;
  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;
  /**
   * Show home button
   */
  showHomeButton?: boolean;
  /**
   * Variant: 'alert' (inline) or 'page' (full page error)
   */
  variant?: 'alert' | 'page';
  /**
   * Severity level
   */
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({
  title = 'Error',
  message = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  showHomeButton = false,
  variant = 'alert',
  severity = 'error',
}: ErrorMessageProps) {
  const getErrorMessage = (): string => {
    if (message) return message;
    
    if (error) {
      if (error instanceof Error) {
        return error.message;
      }
      if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: unknown }).message);
      }
      return 'An unknown error occurred';
    }
    
    return 'An unexpected error occurred';
  };

  // Alert variant (inline)
  if (variant === 'alert') {
    return (
      <Alert
        severity={severity}
        sx={{
          mb: 2,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <Box>
          <Typography variant="body2">{getErrorMessage()}</Typography>
          {process.env.NODE_ENV === 'development' && error && error instanceof Error && error.stack && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 1,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}
              >
                {error.stack}
              </Typography>
            </Box>
          )}
          {onRetry && (
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          )}
        </Box>
      </Alert>
    );
  }

  // Page variant (full page error)
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          border: severity === 'error' ? `1px solid ${colors.error.light}` : undefined,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: 60,
              color: severity === 'error' ? colors.error.main : colors.warning.main,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: colors.neutral.gray900,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.neutral.gray600,
            }}
          >
            {getErrorMessage()}
          </Typography>
          {process.env.NODE_ENV === 'development' && error && error instanceof Error && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: colors.neutral.gray100,
                borderRadius: 1,
                width: '100%',
                textAlign: 'left',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: colors.error.dark,
                  margin: 0,
                }}
              >
                {error.stack || error.toString()}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {onRetry && (
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={onRetry}
                sx={{
                  backgroundColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.dark,
                  },
                }}
              >
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => (window.location.href = '/')}
                sx={{
                  borderColor: colors.neutral.gray300,
                  color: colors.neutral.gray700,
                  '&:hover': {
                    borderColor: colors.primary.main,
                    backgroundColor: colors.primary.main + '10',
                  },
                }}
              >
                Go Home
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

/**
 * Simple inline error message for forms
 */
export function InlineError({ message }: { message: string }) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: colors.error.main,
        display: 'block',
        mt: 0.5,
      }}
    >
      {message}
    </Typography>
  );
}

