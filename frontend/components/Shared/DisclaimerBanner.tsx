'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Box, IconButton, Link, Typography } from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface DisclaimerBannerProps {
  /**
   * Storage key for remembering dismissal state
   * If not provided, banner will not be dismissible
   */
  storageKey?: string;
  /**
   * Variant of the alert
   */
  variant?: 'standard' | 'outlined' | 'filled';
  /**
   * Severity level
   */
  severity?: 'warning' | 'info';
  /**
   * Custom message to display
   */
  message?: string;
  /**
   * Show full disclaimer text or condensed version
   */
  condensed?: boolean;
  /**
   * Callback when banner is dismissed
   */
  onDismiss?: () => void;
}

export default function DisclaimerBanner({
  storageKey = 'atlas-disclaimer-dismissed',
  variant = 'outlined',
  severity = 'warning',
  message,
  condensed = false,
  onDismiss,
}: DisclaimerBannerProps) {
  // Use lazy initialization to avoid setState in effect
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined' && storageKey) {
      return localStorage.getItem(storageKey) === 'true';
    }
    return false;
  });

  const handleDismiss = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, 'true');
    }
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  const defaultMessage = condensed
    ? 'This platform provides insights for informational purposes only. Not financial advice. See Terms of Service for details.'
    : 'This platform provides insights and analysis tools for informational purposes only. We do not provide financial, investment, legal, or tax advice. All investment decisions are made at your own risk. Atlas Investor is not legally bound to any losses that may occur while using this platform.';

  const displayMessage = message || defaultMessage;

  return (
    <Alert
      severity={severity}
      variant={variant}
      icon={<WarningIcon />}
      action={
        storageKey ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleDismiss}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null
      }
      sx={{
        mb: 3,
        border: variant === 'outlined' ? `1px solid ${colors.warning.main}` : undefined,
        backgroundColor: variant === 'filled' ? colors.warning.light : undefined,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <AlertTitle sx={{ fontWeight: 600, mb: 1 }}>
        {condensed ? 'Disclaimer' : 'Important Legal Disclaimer'}
      </AlertTitle>
      <Typography variant="body2" sx={{ color: colors.neutral.gray800, lineHeight: 1.6, mb: condensed ? 0 : 1 }}>
        {displayMessage}
      </Typography>
      {!condensed && (
        <Box sx={{ mt: 1 }}>
          <Link
            href="/terms"
            sx={{
              color: colors.primary.main,
              fontWeight: 600,
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            Read full Terms of Service
          </Link>
        </Box>
      )}
    </Alert>
  );
}

