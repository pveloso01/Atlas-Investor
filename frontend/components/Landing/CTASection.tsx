'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function CTASection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: colors.neutral.gray50,
        borderTop: `1px solid ${colors.neutral.gray200}`,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: colors.neutral.gray900,
            }}
          >
            Ready to Find Your Next Investment?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: colors.neutral.gray600,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Join thousands of investors making smarter real estate decisions in Portugal
          </Typography>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: colors.accent.main,
              color: colors.neutral.white,
              fontSize: '1.1rem',
              px: 5,
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
            Start Your Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
}



