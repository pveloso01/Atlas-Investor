'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { colors } from '@/lib/theme/colors';

const partners = [
  { name: 'Portuguese Government', type: 'Data Source' },
  { name: 'Idealista', type: 'Property Listings' },
  { name: 'INE Portugal', type: 'Demographic Data' },
  { name: 'Municipal Data', type: 'Zoning Information' },
];

export default function TrustLogosSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: colors.neutral.white }}>
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          component="h3"
          sx={{
            textAlign: 'center',
            mb: 4,
            color: colors.neutral.gray600,
            fontWeight: 500,
          }}
        >
          Trusted Data Sources
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            opacity: 0.7,
          }}
        >
          {partners.map((partner, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                color: colors.neutral.gray500,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: '0.95rem',
                }}
              >
                {partner.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.neutral.gray400,
                  fontSize: '0.75rem',
                }}
              >
                {partner.type}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 4,
            color: colors.neutral.gray500,
            fontStyle: 'italic',
          }}
        >
          Data powered by Portuguese Government APIs, Idealista, and proprietary analysis
          algorithms
        </Typography>
      </Container>
    </Box>
  );
}



