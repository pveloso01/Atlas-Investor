'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { Home, Bed, Bathtub, SquareFoot } from '@mui/icons-material';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatPricePerSqm = () => {
    const price = parseFloat(property.price);
    const size = parseFloat(property.size_sqm);
    if (size > 0) {
      return formatPrice(price / size);
    }
    return 'N/A';
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Apartment',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
      mixed: 'Mixed Use',
    };
    return labels[type] || type;
  };

  return (
    <Card
      component={Link}
      href={`/properties/${property.id}`}
      className="h-full flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg no-underline"
    >
      <CardMedia
        component="div"
        className="h-48 bg-gray-300 flex items-center justify-center"
      >
        <Home sx={{ fontSize: 60, color: 'grey.500' }} />
      </CardMedia>

      <CardContent className="flex-grow flex flex-col">
        <Box className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="font-bold text-blue-600">
            {formatPrice(property.price)}
          </Typography>
          <Chip
            label={getPropertyTypeLabel(property.property_type)}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" className="mb-4 min-h-10 text-gray-600">
          {property.address}
        </Typography>

        {property.region && (
          <Typography variant="caption" className="mb-4 text-gray-500">
            {property.region.name}
          </Typography>
        )}

        <Stack direction="row" spacing={2} className="mt-auto pt-4">
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <Box className="flex items-center gap-1">
              <Bed fontSize="small" color="action" />
              <Typography variant="body2">{property.bedrooms}</Typography>
            </Box>
          )}
          {property.bathrooms && (
            <Box className="flex items-center gap-1">
              <Bathtub fontSize="small" color="action" />
              <Typography variant="body2">{property.bathrooms}</Typography>
            </Box>
          )}
          <Box className="flex items-center gap-1 ml-auto">
            <SquareFoot fontSize="small" color="action" />
            <Typography variant="body2">{property.size_sqm} m²</Typography>
          </Box>
        </Stack>

        <Typography variant="caption" className="mt-2 text-right text-gray-500">
          {formatPricePerSqm()} / m²
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;

