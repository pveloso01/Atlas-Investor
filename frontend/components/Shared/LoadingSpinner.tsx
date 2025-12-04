'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '@/lib/theme/colors';

interface LoadingSpinnerProps {
  /**
   * Message to display below the spinner
   */
  message?: string;
  /**
   * Size of the spinner (default: 40)
   */
  size?: number;
  /**
   * Whether to show the spinner in fullscreen mode (default: false)
   */
  fullScreen?: boolean;
  /**
   * Minimum height for the container (default: 200px)
   */
  minHeight?: string | number;
}

export default function LoadingSpinner({
  message = 'Loading...',
  size = 40,
  fullScreen = false,
  minHeight = 200,
}: LoadingSpinnerProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : minHeight,
        gap: 2,
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: colors.primary.main,
        }}
      />
      {message && (
        <Typography
          variant="body1"
          sx={{
            color: colors.neutral.gray600,
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

/**
 * Small inline spinner for buttons or small areas
 */
export function InlineSpinner({ size = 20 }: { size?: number }) {
  return (
    <CircularProgress
      size={size}
      sx={{
        color: 'inherit',
      }}
    />
  );
}

