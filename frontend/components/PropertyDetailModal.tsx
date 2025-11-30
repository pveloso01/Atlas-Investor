'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Bed, Bathtub, SquareFoot, LocationOn, Euro } from '@mui/icons-material';
import { Property } from '@/types/property';

interface PropertyDetailModalProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  open,
  onClose,
}) => {
  if (!property) return null;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            Property Details
          </Typography>
          <Chip
            label={getPropertyTypeLabel(property.property_type)}
            color="primary"
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Price Section */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Euro color="primary" />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatPrice(property.price)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatPricePerSqm()} per m²
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <LocationOn color="action" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{property.address}</Typography>
                {property.region && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {property.region.name}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Property Details */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Property Details
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bed color="action" />
                  <Typography variant="body1">
                    <strong>{property.bedrooms}</strong> Bedroom{property.bedrooms !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}
              {property.bathrooms && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bathtub color="action" />
                  <Typography variant="body1">
                    <strong>{property.bathrooms}</strong> Bathroom{parseFloat(property.bathrooms) !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SquareFoot color="action" />
                <Typography variant="body1">
                  <strong>{property.size_sqm}</strong> m²
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Coordinates */}
          {property.coordinates && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Location
              </Typography>
              <Typography variant="body2">
                Latitude: {property.coordinates[1]}, Longitude: {property.coordinates[0]}
              </Typography>
            </Grid>
          )}

          {/* External ID */}
          {property.external_id && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Reference
              </Typography>
              <Typography variant="body2">{property.external_id}</Typography>
            </Grid>
          )}

          {/* Raw Data Description */}
          {property.raw_data?.description && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1">{property.raw_data.description}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDetailModal;

