'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import PropertyMap from '@/components/PropertyMap';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';

export default function HeroSection() {
  // Fetch a few properties for the map preview
  const { data } = useGetPropertiesQuery({ page: 1, page_size: 10 });

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.neutral.gray50,
        overflow: 'hidden',
      }}
    >
      {/* Background Map Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          zIndex: 0,
        }}
      >
        {data?.results && (
          <PropertyMap properties={data.results} height="100%" />
        )}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 8, md: 12 },
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {/* Headline */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              mb: 3,
              color: colors.neutral.gray900,
              lineHeight: 1.2,
            }}
          >
            Discover and Analyze the Best Property Deals in Portugal
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              color: colors.neutral.gray600,
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            All in One Place – Map-based deal finder, ROI calculator, zoning analysis, and
            marketplace listings
          </Typography>

          {/* CTA Button */}
          <Button
            component={Link}
            href="/signup"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: colors.accent.main,
              color: colors.neutral.white,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.39)',
              '&:hover': {
                backgroundColor: colors.accent.dark,
                boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
}



