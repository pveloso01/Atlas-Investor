import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { Home, Bed, Bath, SquareFoot } from '@mui/icons-material';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
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
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
      }}
      onClick={onClick}
    >
      {/* Placeholder for property image */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundColor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Home sx={{ fontSize: 60, color: 'grey.500' }} />
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Price and Type */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {formatPrice(property.price)}
          </Typography>
          <Chip
            label={getPropertyTypeLabel(property.property_type)}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Address */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {property.address}
        </Typography>

        {/* Region */}
        {property.region && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            {property.region.name}
          </Typography>
        )}

        {/* Property Details */}
        <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2 }}>
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Bed fontSize="small" color="action" />
              <Typography variant="body2">{property.bedrooms}</Typography>
            </Box>
          )}
          {property.bathrooms && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Bath fontSize="small" color="action" />
              <Typography variant="body2">{property.bathrooms}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            <SquareFoot fontSize="small" color="action" />
            <Typography variant="body2">{property.size_sqm} m²</Typography>
          </Box>
        </Stack>

        {/* Price per m² */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
          {formatPricePerSqm()} / m²
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;

