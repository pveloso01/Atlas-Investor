'use client';

import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface FeatureGateProps {
  children: React.ReactNode;
  featureName: string;
  isLocked: boolean;
  onUpgrade?: () => void;
  upgradeMessage?: string;
}

export default function FeatureGate({
  children,
  featureName,
  isLocked,
  onUpgrade,
  upgradeMessage = 'Upgrade to Pro to access this feature',
}: FeatureGateProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: colors.neutral.gray50,
        border: `2px dashed ${colors.neutral.gray300}`,
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.3,
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <LockIcon sx={{ fontSize: 48, color: colors.neutral.gray400, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.neutral.gray700 }}>
          {featureName}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 2 }}>
          {upgradeMessage}
        </Typography>
        {onUpgrade && (
          <Button
            variant="contained"
            onClick={onUpgrade}
            sx={{
              backgroundColor: colors.accent.main,
              '&:hover': {
                backgroundColor: colors.accent.dark,
              },
            }}
          >
            See Plans
          </Button>
        )}
      </Box>
    </Paper>
  );
}

