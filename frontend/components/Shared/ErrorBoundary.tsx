'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Fallback UI to show when an error occurs
   */
  fallback?: ReactNode;
  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully.
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send errors to an error tracking service
    // like Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Show custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              textAlign: 'center',
              border: `1px solid ${colors.error.light}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: colors.error.main,
                }}
              />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: colors.neutral.gray900,
                    mb: 2,
                  }}
                >
                  Something went wrong
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.neutral.gray600,
                    mb: 1,
                  }}
                >
                  We&apos;re sorry for the inconvenience. An unexpected error has occurred.
                </Typography>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: colors.neutral.gray100,
                      borderRadius: 1,
                      textAlign: 'left',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{
                        color: colors.error.dark,
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {this.state.error.toString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                  sx={{
                    backgroundColor: colors.primary.main,
                    '&:hover': {
                      backgroundColor: colors.primary.dark,
                    },
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
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
                  Go to Home
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

