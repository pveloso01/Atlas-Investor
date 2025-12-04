'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, TrendingUp } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import Link from 'next/link';

interface Insight {
  id: string;
  title: string;
  description: string;
  link?: string;
  metric?: string;
}

interface InsightsCarouselProps {
  insights: Insight[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

export default function InsightsCarousel({
  insights,
  autoRotate = true,
  rotationInterval = 5000,
}: InsightsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, insights.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };

  if (insights.length === 0) {
    return null;
  }


  return (
    <Paper
      sx={{
        p: 3,
        border: `1px solid ${colors.neutral.gray200}`,
        borderRadius: 2,
        mb: 3,
        backgroundColor: colors.primary.main + '05',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TrendingUp sx={{ color: colors.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Market Insights
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', minHeight: 100 }}>
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {insights.map((insight, index) => (
            <Box
              key={insight.id}
              sx={{
                minWidth: '100%',
                px: 1,
                display: index === currentIndex ? 'block' : 'none',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.neutral.gray900 }}>
                {insight.title}
              </Typography>
              {insight.metric && (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: colors.accent.main,
                    mb: 1,
                  }}
                >
                  {insight.metric}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: colors.neutral.gray700, mb: 2, lineHeight: 1.7 }}>
                {insight.description}
              </Typography>
              {insight.link && (
                <Button
                  component={Link}
                  href={insight.link}
                  variant="text"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: colors.primary.main,
                    fontWeight: 600,
                  }}
                >
                  View details →
                </Button>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {insights.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {insights.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? colors.primary.main : colors.neutral.gray300,
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </Box>
          <Box>
            <IconButton onClick={handlePrevious} size="small" sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={handleNext} size="small">
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
}


