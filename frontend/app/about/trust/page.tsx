'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import TestimonialsSection from '@/components/Trust/TestimonialsSection';
import { colors } from '@/lib/theme/colors';
import type { Testimonial } from '@/components/Trust/TestimonialsSection';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'Real Estate Developer',
    location: 'Lisbon',
    quote: 'This platform helped me find my first profitable deal in Porto. The ROI calculator saved me hours of manual calculations.',
    customerSince: '2022',
    rating: 5,
  },
  {
    id: '2',
    name: 'Miguel Santos',
    role: 'Investment Analyst',
    location: 'Porto',
    quote: 'The zoning analysis feature is a game-changer. I can quickly assess development potential without consulting multiple sources.',
    customerSince: '2023',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sofia Costa',
    role: 'Beginner Investor',
    location: 'Cascais',
    quote: 'As someone new to real estate investing, the guided analysis and clear metrics made it easy to understand what makes a good deal.',
    customerSince: '2024',
    rating: 5,
  },
];

export default function TrustPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Why Trust Us
      </Typography>
      <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 6, textAlign: 'center' }}>
        Building trust through transparency, expertise, and proven results
      </Typography>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: colors.primary.main, mb: 1 }}>
              1,000+
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Active Investors
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Trusted by real estate professionals across Portugal
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: colors.primary.main, mb: 1 }}>
              10,000+
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Deals Analyzed
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Comprehensive analysis of properties across Portugal
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: colors.primary.main, mb: 1 }}>
              15%
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Average ROI Improvement
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Our users see better returns with our insights
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
          Success Stories
        </Typography>
        <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            From Zero to Five Properties
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
            Maria, a beginner investor from Lisbon, started using Atlas Investor in 2022 with no
            prior real estate experience. Using our platform&apos;s guided analysis and deal finder, she
            identified her first investment property within two weeks. Over the next 18 months, she
            expanded her portfolio to five properties, all with positive cash flow and strong ROI
            projections.
          </Typography>
          <Typography variant="body2" sx={{ color: colors.neutral.gray600, fontStyle: 'italic' }}>
            &ldquo;The platform made it easy to understand what makes a good deal. I couldn&apos;t have done
            this without Atlas Investor.&rdquo; - Maria, Lisbon
          </Typography>
        </Paper>
      </Box>

      <TestimonialsSection testimonials={testimonials} title="What Our Users Say" />
    </Container>
  );
}

