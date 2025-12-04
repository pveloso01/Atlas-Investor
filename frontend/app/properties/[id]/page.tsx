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
  Grid,
} from '@mui/material';
import { Bed, Bathtub, SquareFoot, LocationOn, Euro, ArrowBack } from '@mui/icons-material';
import { useGetPropertyQuery } from '@/lib/store/api/propertyApi';
import type { Property } from '@/types/property';
import InvestmentMetrics from '@/components/PropertyDetails/InvestmentMetrics';
import ROICalculator from '@/components/PropertyDetails/ROICalculator';
import PropertyCharts from '@/components/PropertyDetails/PropertyCharts';
import ZoningInfo from '@/components/PropertyDetails/ZoningInfo';
import MarketComparison from '@/components/PropertyDetails/MarketComparison';
import ScenarioComparison from '@/components/PropertyDetails/ScenarioComparison';
import PropertyActions from '@/components/PropertyDetails/PropertyActions';
import { colors } from '@/lib/theme/colors';

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
  
  // Type assertion to help TypeScript inference
  const typedProperty = property as Property | undefined;

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

  if (!typedProperty) {
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
    <Container maxWidth="xl" className="py-8">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/properties')}
        variant="outlined"
        className="mb-4"
      >
        Back to Properties
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Header Section */}
          <Paper sx={{ p: 4, mb: 4, border: `1px solid ${colors.neutral.gray200}` }}>
            <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  {typedProperty.bedrooms ? `${typedProperty.bedrooms}-Bed ` : ''}
                  {getPropertyTypeLabel(typedProperty.property_type)} in{' '}
                  {typedProperty.region?.name || 'Portugal'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn sx={{ color: colors.neutral.gray600, fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: colors.neutral.gray600 }}>
                    {typedProperty.address}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={getPropertyTypeLabel(typedProperty.property_type)}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.9rem', fontWeight: 600 }}
              />
            </Box>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Euro sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: colors.primary.main }}>
                  {formatPrice(typedProperty.price)}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray600 }}>
                {formatPricePerSqm(typedProperty.price, typedProperty.size_sqm)} per m²
              </Typography>
            </Box>

            {/* Property Images Placeholder */}
            <Box
              sx={{
                width: '100%',
                height: 400,
                backgroundColor: colors.neutral.gray200,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Typography variant="body1" sx={{ color: colors.neutral.gray500 }}>
                Property Images Carousel (Placeholder)
              </Typography>
            </Box>

            {/* Temporarily commented out due to TypeScript issue */}
            {/* {mapSection} */}

            {/* Property Details */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Property Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {typedProperty.bedrooms != null && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bed sx={{ color: colors.primary.main }} />
                    <Typography variant="body1">
                      <strong>{typedProperty.bedrooms}</strong> Bedroom{typedProperty.bedrooms !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
                {typedProperty.bathrooms && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bathtub sx={{ color: colors.primary.main }} />
                    <Typography variant="body1">
                      <strong>{typedProperty.bathrooms}</strong> Bathroom{parseFloat(String(typedProperty.bathrooms)) !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SquareFoot sx={{ color: colors.primary.main }} />
                  <Typography variant="body1">
                    <strong>{typedProperty.size_sqm}</strong> m²
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Description */}
            {typedProperty.raw_data?.description && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.7 }}>
                    {String(typedProperty.raw_data.description || '')}
                  </Typography>
                </Box>
              </>
            )}
            </>
          </Paper>

          {/* Investment Metrics */}
          <InvestmentMetrics />

          {/* ROI Calculator */}
          <ROICalculator propertyPrice={parseFloat(typedProperty.price)} />

          {/* Charts */}
          <PropertyCharts propertyYield={5.2} marketAverageYield={4.8} />

          {/* Zoning Info */}
          <ZoningInfo />

          {/* Market Comparison */}
          <MarketComparison propertyYield={5.2} percentileRank={85} />

          {/* Scenario Comparison */}
          <ScenarioComparison propertyPrice={parseFloat(typedProperty.price)} />
        </Grid>

        {/* Sidebar - Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <PropertyActions property={typedProperty} />
        </Grid>
      </Grid>
    </Container>
  );
}
