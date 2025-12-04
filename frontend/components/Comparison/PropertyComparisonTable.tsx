'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Euro,
  SquareFoot,
  Bed,
  CalendarMonth,
  TrendingUp,
  LocationOn,
  Check,
  Clear,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface ComparisonProperty {
  id: number;
  address: string;
  price: string | number;
  size_sqm: string | number;
  bedrooms?: number;
  property_type: string;
  images?: string[];
  year_built?: number;
  rental_yield?: number;
  region?: { name: string };
  has_parking?: boolean;
  has_terrace?: boolean;
  has_elevator?: boolean;
}

interface PropertyComparisonTableProps {
  properties: ComparisonProperty[];
  onRemove?: (propertyId: number) => void;
  onViewDetails?: (propertyId: number) => void;
}

export default function PropertyComparisonTable({
  properties,
  onRemove,
  onViewDetails,
}: PropertyComparisonTableProps) {
  const formatPrice = (price: string | number) => {
    const priceNum = typeof price === 'string' ? parseInt(price) : price;
    return `€${priceNum.toLocaleString('pt-PT')}`;
  };

  const formatPricePerSqm = (price: string | number, size: string | number) => {
    const priceNum = typeof price === 'string' ? parseInt(price) : price;
    const sizeNum = typeof size === 'string' ? parseFloat(size) : size;
    if (sizeNum === 0) return 'N/A';
    return `€${Math.round(priceNum / sizeNum).toLocaleString('pt-PT')}/m²`;
  };

  if (properties.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No properties to compare
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
          Select 2-4 properties from your saved list to compare them side by side
        </Typography>
      </Paper>
    );
  }

  const rows = [
    {
      label: 'Price',
      icon: <Euro fontSize="small" />,
      getValue: (p: ComparisonProperty) => formatPrice(p.price),
      highlight: true,
    },
    {
      label: 'Size',
      icon: <SquareFoot fontSize="small" />,
      getValue: (p: ComparisonProperty) => `${p.size_sqm} m²`,
    },
    {
      label: 'Price/m²',
      icon: <Euro fontSize="small" />,
      getValue: (p: ComparisonProperty) => formatPricePerSqm(p.price, p.size_sqm),
      highlight: true,
    },
    {
      label: 'Bedrooms',
      icon: <Bed fontSize="small" />,
      getValue: (p: ComparisonProperty) => p.bedrooms?.toString() || 'N/A',
    },
    {
      label: 'Property Type',
      icon: null,
      getValue: (p: ComparisonProperty) => (
        <Chip label={p.property_type} size="small" sx={{ textTransform: 'capitalize' }} />
      ),
    },
    {
      label: 'Location',
      icon: <LocationOn fontSize="small" />,
      getValue: (p: ComparisonProperty) => p.region?.name || 'Unknown',
    },
    {
      label: 'Year Built',
      icon: <CalendarMonth fontSize="small" />,
      getValue: (p: ComparisonProperty) => p.year_built?.toString() || 'N/A',
    },
    {
      label: 'Est. Rental Yield',
      icon: <TrendingUp fontSize="small" />,
      getValue: (p: ComparisonProperty) =>
        p.rental_yield ? `${p.rental_yield.toFixed(1)}%` : 'N/A',
      highlight: true,
    },
    {
      label: 'Parking',
      icon: null,
      getValue: (p: ComparisonProperty) =>
        p.has_parking ? (
          <Check sx={{ color: colors.success.main }} />
        ) : (
          <Clear sx={{ color: colors.error.main }} />
        ),
    },
    {
      label: 'Terrace',
      icon: null,
      getValue: (p: ComparisonProperty) =>
        p.has_terrace ? (
          <Check sx={{ color: colors.success.main }} />
        ) : (
          <Clear sx={{ color: colors.error.main }} />
        ),
    },
    {
      label: 'Elevator',
      icon: null,
      getValue: (p: ComparisonProperty) =>
        p.has_elevator ? (
          <Check sx={{ color: colors.success.main }} />
        ) : (
          <Clear sx={{ color: colors.error.main }} />
        ),
    },
  ];

  return (
    <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                backgroundColor: colors.neutral.gray100,
                width: 150,
                position: 'sticky',
                left: 0,
                zIndex: 3,
              }}
            >
              Feature
            </TableCell>
            {properties.map((property) => (
              <TableCell
                key={property.id}
                align="center"
                sx={{
                  backgroundColor: colors.neutral.gray100,
                  minWidth: 200,
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {onRemove && (
                    <IconButton
                      size="small"
                      onClick={() => onRemove(property.id)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Avatar
                    src={property.images?.[0]}
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 60,
                      mx: 'auto',
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 180,
                    }}
                  >
                    {property.address.split(',')[0]}
                  </Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: colors.neutral.gray50,
                },
                ...(row.highlight && {
                  backgroundColor: `${colors.primary.light}20 !important`,
                }),
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  position: 'sticky',
                  left: 0,
                  backgroundColor: row.highlight
                    ? `${colors.primary.light}20`
                    : 'inherit',
                  zIndex: 1,
                }}
              >
                {row.icon}
                {row.label}
              </TableCell>
              {properties.map((property) => (
                <TableCell key={property.id} align="center">
                  {row.getValue(property)}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                position: 'sticky',
                left: 0,
                backgroundColor: colors.neutral.white,
                zIndex: 1,
              }}
            >
              Actions
            </TableCell>
            {properties.map((property) => (
              <TableCell key={property.id} align="center">
                {onViewDetails && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onViewDetails(property.id)}
                    sx={{
                      backgroundColor: colors.primary.main,
                      '&:hover': { backgroundColor: colors.primary.dark },
                    }}
                  >
                    View Details
                  </Button>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

