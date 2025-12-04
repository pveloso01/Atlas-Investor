'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { colors } from '@/lib/theme/colors';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  image?: string;
  quote: string;
  customerSince?: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export default function TestimonialsSection({
  testimonials,
  title = 'Trusted by Real Estate Professionals',
  subtitle = 'See what our users are saying',
  maxItems,
}: TestimonialsSectionProps) {
  const displayTestimonials = maxItems ? testimonials.slice(0, maxItems) : testimonials;

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
          {title}
        </Typography>
        {subtitle && (
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
            {subtitle}
          </Typography>
        )}

        <Grid container spacing={4}>
          {displayTestimonials.map((testimonial) => (
            <Grid size={{ xs: 12, sm: 6 }} key={testimonial.id}>
              <Card
                sx={{
                  height: '100%',
                  border: `1px solid ${colors.neutral.gray200}`,
                  borderRadius: 2,
                  backgroundColor: colors.neutral.white,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {testimonial.rating && (
                    <Box sx={{ mb: 2 }}>
                      {'★'.repeat(testimonial.rating)}
                      {'☆'.repeat(5 - testimonial.rating)}
                    </Box>
                  )}
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
                      <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                        {testimonial.role}, {testimonial.location}
                      </Typography>
                      {testimonial.customerSince && (
                        <Typography
                          variant="caption"
                          sx={{ color: colors.neutral.gray500, fontStyle: 'italic' }}
                        >
                          Customer since {testimonial.customerSince}
                        </Typography>
                      )}
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

