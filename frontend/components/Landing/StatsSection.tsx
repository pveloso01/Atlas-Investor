'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { TrendingUp, Assessment, People, Verified } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

const stats = [
  {
    icon: Assessment,
    value: '10,000+',
    label: 'Deals Analyzed',
    color: colors.primary.main,
  },
  {
    icon: TrendingUp,
    value: '15%',
    label: 'Average ROI Improvement',
    color: colors.success.main,
  },
  {
    icon: People,
    value: '1,000+',
    label: 'Active Investors',
    color: colors.info.main,
  },
  {
    icon: Verified,
    value: '99.9%',
    label: 'Data Accuracy',
    color: colors.success.main,
  },
];

export default function StatsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: colors.primary.main,
        color: colors.neutral.white,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: colors.neutral.white,
          }}
        >
          Proven Results
        </Typography>

        <Grid container spacing={4}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 40, color: colors.neutral.white }} />
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

