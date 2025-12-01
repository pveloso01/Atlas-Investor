'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Map as MapIcon,
  Calculate as CalculateIcon,
  Assessment as AssessmentIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

const features = [
  {
    icon: MapIcon,
    title: 'Map-based Deal Finder',
    description:
      'Explore properties on an interactive map of Portugal. Filter by location, price, ROI, and more. See deals in context with neighborhood data.',
  },
  {
    icon: CalculateIcon,
    title: 'ROI & Yield Calculator',
    description:
      'Calculate rental yield, cash flow, and return on investment with our interactive calculator. Adjust assumptions in real-time to see how they affect returns.',
  },
  {
    icon: AssessmentIcon,
    title: 'Zoning & Feasibility Analysis',
    description:
      'Understand development potential with zoning information and feasibility analysis. See what you can build and estimate costs.',
  },
  {
    icon: StoreIcon,
    title: 'Marketplace Listings',
    description:
      'Browse verified property listings from trusted sources. Compare deals side-by-side and save your favorites for later analysis.',
  },
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: colors.neutral.white }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            color: colors.neutral.gray900,
          }}
        >
          Everything You Need to Invest Smarter
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            textAlign: 'center',
            mb: 6,
            color: colors.neutral.gray600,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Powerful tools and analytics in one platform
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: `1px solid ${colors.neutral.gray200}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      borderColor: colors.primary.main,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: colors.primary.main + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: colors.primary.main }} />
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: colors.neutral.gray900,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.neutral.gray600,
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

