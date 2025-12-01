'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { colors } from '@/lib/theme/colors';

const testimonials = [
  {
    name: 'Ana Silva',
    role: 'Real Estate Developer',
    location: 'Lisbon',
    image: '/api/placeholder/80/80',
    quote:
      'This platform helped me find my first profitable deal in Porto. The ROI calculator saved me hours of manual calculations.',
    customerSince: '2022',
  },
  {
    name: 'Miguel Santos',
    role: 'Investment Analyst',
    location: 'Porto',
    image: '/api/placeholder/80/80',
    quote:
      'The zoning analysis feature is a game-changer. I can quickly assess development potential without consulting multiple sources.',
    customerSince: '2023',
  },
  {
    name: 'Sofia Costa',
    role: 'Beginner Investor',
    location: 'Cascais',
    image: '/api/placeholder/80/80',
    quote:
      'As someone new to real estate investing, the guided analysis and clear metrics made it easy to understand what makes a good deal.',
    customerSince: '2024',
  },
  {
    name: 'Carlos Ferreira',
    role: 'Portfolio Manager',
    location: 'Lisbon',
    image: '/api/placeholder/80/80',
    quote:
      'I manage 20+ properties and this platform helps me track opportunities across Portugal efficiently. The map view is invaluable.',
    customerSince: '2022',
  },
];

export default function TestimonialsSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: colors.neutral.gray50 }}>
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
          Trusted by Real Estate Professionals
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
          See what our users are saying
        </Typography>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: `1px solid ${colors.neutral.gray200}`,
                  borderRadius: 2,
                  backgroundColor: colors.neutral.white,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: colors.neutral.gray700,
                      fontStyle: 'italic',
                      lineHeight: 1.7,
                    }}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: colors.primary.main,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: colors.neutral.gray900 }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.neutral.gray600 }}
                      >
                        {testimonial.role}, {testimonial.location}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colors.neutral.gray500, fontStyle: 'italic' }}
                      >
                        Customer since {testimonial.customerSince}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

