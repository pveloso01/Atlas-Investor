'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ZoningInfoProps {
  zoning?: string;
  developmentPotential?: number;
  maxFloors?: number;
  canAddExtension?: boolean;
  shortTermRentalEligible?: boolean;
}

export default function ZoningInfo({
  zoning = 'Residential Zone – R2',
  developmentPotential = 8,
  maxFloors = 3,
  canAddExtension = true,
  shortTermRentalEligible = true,
}: ZoningInfoProps) {
  const features = [
    {
      label: 'Can add extension',
      value: canAddExtension,
      description: 'Property permits additional construction',
    },
    {
      label: 'Eligible for short-term rental license',
      value: shortTermRentalEligible,
      description: 'Can be used for Airbnb/short-term rentals',
    },
    {
      label: `Maximum ${maxFloors} floors permitted`,
      value: true,
      description: `Zoning allows up to ${maxFloors} floors`,
    },
  ];

  return (
    <Card
      sx={{
        border: `1px solid ${colors.neutral.gray200}`,
        borderRadius: 2,
        mb: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <MapIcon sx={{ color: colors.primary.main }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Zoning & Development Potential
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={zoning}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 2 }}
          />
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.7 }}>
            Zoning permits up to {maxFloors} floors – suitable for adding units or expanding the
            property. This classification allows for residential development with potential for
            mixed-use applications.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Development Potential Score: {developmentPotential}/10
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 8,
              backgroundColor: colors.neutral.gray200,
              borderRadius: 1,
              overflow: 'hidden',
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: `${(developmentPotential / 10) * 100}%`,
                height: '100%',
                backgroundColor:
                  developmentPotential >= 7
                    ? colors.success.main
                    : developmentPotential >= 5
                    ? colors.warning.main
                    : colors.error.main,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
            {developmentPotential >= 7
              ? 'High development potential'
              : developmentPotential >= 5
              ? 'Moderate development potential'
              : 'Limited development potential'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Development Features
          </Typography>
          <List>
            {features.map((feature, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  {feature.value ? (
                    <CheckCircleIcon sx={{ color: colors.success.main }} />
                  ) : (
                    <InfoIcon sx={{ color: colors.neutral.gray400 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={feature.label}
                  secondary={feature.description}
                  primaryTypographyProps={{
                    fontWeight: feature.value ? 600 : 400,
                    color: feature.value ? colors.neutral.gray900 : colors.neutral.gray600,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: colors.neutral.gray500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: colors.info.main + '10',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <InfoIcon sx={{ color: colors.info.main, fontSize: 20, mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: colors.neutral.gray700, lineHeight: 1.6 }}>
            <strong>Note:</strong> Zoning information is based on municipal records and may be
            subject to change. Always verify current zoning regulations with local authorities
            before making development decisions. Click{' '}
            <strong style={{ color: colors.primary.main, cursor: 'pointer' }}>here</strong> to view
            the full zoning map.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}



