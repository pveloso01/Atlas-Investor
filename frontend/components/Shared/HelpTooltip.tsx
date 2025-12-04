'use client';

import React from 'react';
import { Tooltip, IconButton, Box, Typography } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface HelpTooltipProps {
  title: string;
  description?: string;
  glossaryLink?: string;
}

export default function HelpTooltip({ title, description, glossaryLink }: HelpTooltipProps) {
  const tooltipContent = (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          {description}
        </Typography>
      )}
      {glossaryLink && (
        <Typography
          variant="caption"
          component="a"
          href={glossaryLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: colors.primary.light,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Learn more in glossary →
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <IconButton
        size="small"
        sx={{
          p: 0.5,
          color: colors.neutral.gray500,
          '&:hover': {
            color: colors.primary.main,
            backgroundColor: colors.primary.main + '10',
          },
        }}
      >
        <InfoIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
}

