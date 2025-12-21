'use client';

import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface LoadingAnimationsProps {
  type?: 'spinner' | 'house' | 'progress';
  message?: string;
  milestones?: string[];
  currentMilestone?: number;
}

export default function LoadingAnimations({
  type = 'spinner',
  message = 'Loading...',
  milestones = [],
  currentMilestone = 0,
}: LoadingAnimationsProps) {
  if (type === 'house') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Box
          sx={{
            animation: 'rotate 2s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          <HomeIcon sx={{ fontSize: 64, color: colors.primary.main }} />
        </Box>
        <Typography variant="body1" sx={{ mt: 2, color: colors.neutral.gray600 }}>
          {message}
        </Typography>
      </Box>
    );
  }

  if (type === 'progress' && milestones.length > 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          {message}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {milestones.map((milestone, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                opacity: index <= currentMilestone ? 1 : 0.5,
              }}
            >
              <CircularProgress
                size={24}
                variant={
                  index < currentMilestone
                    ? 'determinate'
                    : index === currentMilestone
                      ? 'indeterminate'
                      : 'determinate'
                }
                value={index < currentMilestone ? 100 : 0}
                sx={{
                  color: index < currentMilestone ? colors.success.main : colors.primary.main,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color:
                    index <= currentMilestone ? colors.neutral.gray900 : colors.neutral.gray500,
                  fontWeight: index === currentMilestone ? 600 : 400,
                }}
              >
                {milestone}
              </Typography>
            </Box>
          ))}
        </Box>
        <LinearProgress
          variant="determinate"
          value={(currentMilestone / milestones.length) * 100}
          sx={{
            height: 8,
            borderRadius: 1,
            backgroundColor: colors.neutral.gray200,
            '& .MuiLinearProgress-bar': {
              backgroundColor: colors.primary.main,
              borderRadius: 1,
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <CircularProgress sx={{ color: colors.primary.main }} />
      <Typography variant="body1" sx={{ mt: 2, color: colors.neutral.gray600 }}>
        {message}
      </Typography>
    </Box>
  );
}
