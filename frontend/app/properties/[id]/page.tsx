'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Button,
  Paper,
} from '@mui/material';
import { Bed, Bathtub, SquareFoot, LocationOn, Euro, ArrowBack } from '@mui/icons-material';
import { useGetPropertyQuery } from '@/lib/store/api/propertyApi';

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(numPrice);
};

const formatPricePerSqm = (price: string | number, size: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numSize = typeof size === 'string' ? parseFloat(size) : size;
  if (numSize > 0) {
    return formatPrice(numPrice / numSize);
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

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = parseInt(params.id as string, 10);

  const { data: property, error, isLoading } = useGetPropertyQuery(propertyId);

  if (isLoading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error" className="mb-8">
          <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            Failed to load property
          </Typography>
          <Typography variant="body2" component="div">
            {error && 'status' in error && error.status === 'PARSING_ERROR'
              ? 'The server returned an invalid response. Please try refreshing the page.'
              : error && 'status' in error && error.data && typeof error.data === 'object' && 'detail' in error.data
              ? String(error.data.detail)
              : 'Please check if the backend API is running and accessible.'}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/properties')}
          variant="outlined"
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="warning" className="mb-8">
          <Typography variant="body1" component="div">
            Property not found
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/properties')}
          variant="outlined"
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/properties')}
        variant="outlined"
        className="mb-4"
      >
        Back to Properties
      </Button>

      <Paper sx={{ p: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Property Details
          </Typography>
          <Chip
            label={getPropertyTypeLabel(property.property_type)}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} component="div">
          {/* Price Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Euro color="primary" />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatPrice(property.price)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatPricePerSqm(property.price, property.size_sqm)} per m²
            </Typography>
          </Box>

          <Divider />

          {/* Address */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <LocationOn color="action" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{property.address}</Typography>
                {property.region ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {property.region.name}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </Box>

          {/* Property Details */}
          <div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Property Details
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
              {property.bedrooms != null ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bed color="action" />
                  <Typography variant="body1">
                    <strong>{property.bedrooms}</strong> Bedroom{property.bedrooms !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              ) : null}
              {property.bathrooms ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bathtub color="action" />
                  <Typography variant="body1">
                    <strong>{property.bathrooms}</strong> Bathroom{parseFloat(String(property.bathrooms)) !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              ) : null}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SquareFoot color="action" />
                <Typography variant="body1">
                  <strong>{property.size_sqm}</strong> m²
                </Typography>
              </Box>
            </div>
          </div>

          {/* Coordinates */}
          {property.coordinates ? (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Location
              </Typography>
              <Typography variant="body2">
                Latitude: {property.coordinates[1]}, Longitude: {property.coordinates[0]}
              </Typography>
            </Box>
          ) : null}

          {/* External ID */}
          {property.external_id ? (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Reference
              </Typography>
              <Typography variant="body2">{property.external_id}</Typography>
            </Box>
          ) : null}

          {/* Raw Data Description */}
          {property.raw_data?.description ? (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1">{String(property.raw_data.description || '')}</Typography>
              </Box>
            </>
          ) : null}
        </Box>
      </Paper>
    </Container>
  );
}
