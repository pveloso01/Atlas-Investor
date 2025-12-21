'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';
import PropertyCard from '@/components/PropertyCard';
import FilterPanel, { FilterState } from '@/components/Dashboard/FilterPanel';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import InsightsCarousel from '@/components/Dashboard/InsightsCarousel';
import LoadingSpinner from '@/components/Shared/LoadingSpinner';
import ErrorMessage from '@/components/Shared/ErrorMessage';
import { ListItemSkeleton } from '@/components/Shared/SkeletonLoader';
import DisclaimerBanner from '@/components/Shared/DisclaimerBanner';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { Property } from '@/types/property';
import { useRouter } from 'next/navigation';
import { colors } from '@/lib/theme/colors';

// Lazy load PropertyMap (heavy component with Mapbox)
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  loading: () => <LoadingSpinner message="Loading map..." />,
  ssr: false,
});

const defaultFilters: FilterState = {
  search: '',
  propertyType: '',
  region: '',
  minPrice: 0,
  maxPrice: 2000000,
  minROI: 0,
  maxROI: 50,
  minYield: 0,
  maxYield: 20,
};

export default function DashboardPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Build query params from filters
  const queryParams: {
    page: number;
    page_size: number;
    search?: string;
    property_type?: string;
    region?: number;
    min_price?: number;
    max_price?: number;
  } = {
    page: 1,
    page_size: 100,
  };

  if (filters.search) queryParams.search = filters.search;
  if (filters.propertyType) queryParams.property_type = filters.propertyType;
  if (filters.region) queryParams.region = parseInt(filters.region);
  if (filters.minPrice > 0) queryParams.min_price = filters.minPrice;
  if (filters.maxPrice < 2000000) queryParams.max_price = filters.maxPrice;

  const { data, isLoading, isError, error, refetch } = useGetPropertiesQuery(queryParams);

  // Filter properties client-side for ROI/Yield (since backend may not support these)
  const filteredProperties =
    data?.results?.filter(() => {
      // Add client-side filtering logic here if needed
      return true;
    }) || [];

  const handlePropertyClick = useCallback(
    (property: Property) => {
      setSelectedProperty(property);
      router.push(`/properties/${property.id}`);
    },
    [router]
  );

  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Calculate summary stats
  const averageYield = 5.2; // Placeholder - would come from API
  const averageROI = 12.5; // Placeholder - would come from API

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, mb: 3, color: colors.neutral.gray900 }}
      >
        Deal Finder Dashboard
      </Typography>

      {/* Disclaimer Banner */}
      <DisclaimerBanner storageKey="atlas-dashboard-disclaimer" />

      {/* Summary Cards */}
      <SummaryCards
        properties={filteredProperties}
        averageYield={averageYield}
        averageROI={averageROI}
      />

      {/* Insights Carousel */}
      <InsightsCarousel
        insights={[
          {
            id: '1',
            title: 'Market Insight',
            description: 'Lisbon has the highest rental yield this quarter, averaging 5.8%',
            metric: '5.8%',
            link: '/properties?region=1',
          },
          {
            id: '2',
            title: 'Trending',
            description: 'Properties in Porto are showing 15% ROI improvement over last quarter',
            metric: '+15%',
            link: '/properties?region=2',
          },
          {
            id: '3',
            title: 'Opportunity',
            description: 'Development opportunities in Cascais are up 30% this month',
            metric: '+30%',
            link: '/properties?region=3&property_type=land',
          },
        ]}
      />

      {/* Split Screen Layout */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', lg: 'row' },
          height: { xs: 'auto', lg: 'calc(100vh - 300px)' },
        }}
      >
        {/* Left: Map (2/3 on desktop) */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', lg: '2 1 66%' },
            minHeight: { xs: '400px', lg: '100%' },
            position: 'relative',
          }}
        >
          <Paper
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${colors.neutral.gray200}`,
            }}
          >
            <PropertyMap
              properties={filteredProperties}
              onPropertyClick={handlePropertySelect}
              selectedPropertyId={selectedProperty?.id || null}
              height="100%"
            />
          </Paper>
        </Box>

        {/* Right: Filters + Property List (1/3 on desktop) */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', lg: '1 1 34%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden',
          }}
        >
          {/* Filter Panel */}
          <Box sx={{ flexShrink: 0 }}>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />
          </Box>

          {/* Property List */}
          <Paper
            sx={{
              flex: 1,
              overflow: 'auto',
              borderRadius: 2,
              border: `1px solid ${colors.neutral.gray200}`,
              p: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: colors.neutral.gray700 }}
            >
              Properties ({filteredProperties.length})
            </Typography>

            {isLoading ? (
              <Box>
                {Array.from({ length: 3 }).map((_, index) => (
                  <ListItemSkeleton key={index} />
                ))}
              </Box>
            ) : isError ? (
              <ErrorMessage
                title="Failed to load properties"
                message="There was an error loading the properties. Please try again."
                error={error}
                onRetry={refetch}
                variant="alert"
              />
            ) : filteredProperties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: colors.neutral.gray500 }}>
                No properties found. Try adjusting your filters.
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {filteredProperties.map((property) => (
                  <Box
                    key={property.id}
                    onClick={() => handlePropertyClick(property)}
                    sx={{
                      cursor: 'pointer',
                      opacity: selectedProperty?.id === property.id ? 1 : 0.9,
                      transform: selectedProperty?.id === property.id ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      border:
                        selectedProperty?.id === property.id
                          ? `2px solid ${colors.primary.main}`
                          : `1px solid ${colors.neutral.gray200}`,
                      borderRadius: 2,
                      p: 1,
                    }}
                  >
                    <PropertyCard property={property} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
      </Container>
    </ProtectedRoute>
  );
}


