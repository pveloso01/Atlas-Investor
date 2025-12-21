'use client';

import React, { useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Grid,
  Skeleton,
  useTheme,
} from '@mui/material';
import { ViewList, ViewModule, Map as MapIcon, Tune as TuneIcon } from '@mui/icons-material';
import { useGetPropertiesQuery, PropertyListParams } from '@/lib/store/api/propertyApi';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/PropertyMap';
import FilterPanel from '@/components/Properties/FilterPanel';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';
import { useRouter } from 'next/navigation';

type ViewMode = 'grid' | 'list';

const defaultFilters: PropertyListParams = {
  search: '',
  property_type: [],
  min_price: 0,
  max_price: 2000000,
  min_size: 0,
  max_size: 1000,
  min_bedrooms: 0,
  max_bedrooms: 10,
  min_bathrooms: 0,
  max_bathrooms: 10,
  min_year_built: 1900,
  max_year_built: new Date().getFullYear(),
  condition: [],
  energy_rating: [],
  has_elevator: undefined,
  has_balcony: undefined,
  has_terrace: undefined,
  min_parking_spaces: 0,
  listing_status: [],
  ordering: '-created_at',
  district: [],
  municipality: [],
  parish: [],
};

export default function PropertiesPage() {
  const router = useRouter();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMap, setShowMap] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState<PropertyListParams>(defaultFilters);

  // Persist filters to localStorage
  const { clearFilters: clearPersistedFilters } = useFilterPersistence(filters, setFilters);

  // Build query params from filters
  const queryParams: PropertyListParams = {
    page,
    page_size: pageSize,
    ordering: filters.ordering || '-created_at',
  };

  if (filters.search) queryParams.search = filters.search;
  const propertyTypes = Array.isArray(filters.property_type) ? filters.property_type : (filters.property_type ? [filters.property_type] : []);
  if (propertyTypes.length > 0) queryParams.property_type = propertyTypes;
  if (filters.region) {
    const regions = Array.isArray(filters.region) ? filters.region : [filters.region];
    queryParams.region = regions.length === 1 ? regions[0] : regions;
  }
  if (filters.min_price && filters.min_price > 0) queryParams.min_price = filters.min_price;
  if (filters.max_price && filters.max_price < 2000000) queryParams.max_price = filters.max_price;
  if (filters.min_size && filters.min_size > 0) queryParams.min_size = filters.min_size;
  if (filters.max_size && filters.max_size < 1000) queryParams.max_size = filters.max_size;
  if (filters.min_bedrooms && filters.min_bedrooms > 0) queryParams.min_bedrooms = filters.min_bedrooms;
  if (filters.max_bedrooms && filters.max_bedrooms < 10) queryParams.max_bedrooms = filters.max_bedrooms;
  if (filters.min_bathrooms && filters.min_bathrooms > 0) queryParams.min_bathrooms = filters.min_bathrooms;
  if (filters.max_bathrooms && filters.max_bathrooms < 10) queryParams.max_bathrooms = filters.max_bathrooms;
  if (filters.min_year_built && filters.min_year_built > 1900) queryParams.min_year_built = filters.min_year_built;
  if (filters.max_year_built && filters.max_year_built < new Date().getFullYear()) queryParams.max_year_built = filters.max_year_built;
  const conditions = Array.isArray(filters.condition) ? filters.condition : (filters.condition ? [filters.condition] : []);
  if (conditions.length > 0) queryParams.condition = conditions;
  const energyRatings = Array.isArray(filters.energy_rating) ? filters.energy_rating : (filters.energy_rating ? [filters.energy_rating] : []);
  if (energyRatings.length > 0) queryParams.energy_rating = energyRatings;
  if (filters.has_elevator !== undefined) queryParams.has_elevator = filters.has_elevator;
  if (filters.has_balcony !== undefined) queryParams.has_balcony = filters.has_balcony;
  if (filters.has_terrace !== undefined) queryParams.has_terrace = filters.has_terrace;
  if (filters.min_parking_spaces && filters.min_parking_spaces > 0) queryParams.min_parking_spaces = filters.min_parking_spaces;
  const listingStatuses = Array.isArray(filters.listing_status) ? filters.listing_status : (filters.listing_status ? [filters.listing_status] : []);
  if (listingStatuses.length > 0) queryParams.listing_status = listingStatuses;

  const { data, error, isLoading } = useGetPropertiesQuery(queryParams);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleFiltersChange = useCallback((newFilters: PropertyListParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    clearPersistedFilters();
    setPage(1);
  }, [clearPersistedFilters]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
          }}
        >
          Properties
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 3,
          }}
        >
          Discover your perfect property investment in Portugal
        </Typography>

        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant={filtersOpen ? 'contained' : 'outlined'}
              startIcon={<TuneIcon />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              size="medium"
            >
              {filtersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {data && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {data.count || 0} properties found
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant={showMap ? 'contained' : 'outlined'}
              startIcon={<MapIcon />}
              onClick={() => setShowMap(!showMap)}
              size="medium"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            {!showMap && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="medium"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>
      </Box>

      {/* Filters - Horizontal Layout */}
      {filtersOpen && (
        <Box sx={{ mb: 3 }}>
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box>
          {/* Loading State */}
          {isLoading && (
            <Box>
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={index}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                Failed to load properties
              </Typography>
              <Typography variant="body2" component="div">
                {error && 'status' in error && error.status === 'PARSING_ERROR'
                  ? 'The server returned an invalid response. Please try refreshing the page.'
                  : error && 'status' in error && error.data && typeof error.data === 'object' && 'detail' in error.data
                  ? String(error.data.detail)
                  : 'Please check if the backend API is running and accessible.'}
              </Typography>
            </Alert>
          )}

          {/* Map View */}
          {showMap && data && data.results && (
            <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <PropertyMap
                properties={data.results}
                onPropertyClick={(property) => {
                  router.push(`/properties/${property.id}`);
                }}
                height={600}
              />
            </Box>
          )}

          {/* Properties Grid/List */}
          {!showMap && data && data.results && data.results.length > 0 && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr',
                    md: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr',
                    lg: viewMode === 'grid' ? 'repeat(4, 1fr)' : '1fr',
                  },
                  gap: 3,
                }}
              >
                {data.results.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </Box>

              {/* Pagination */}
              {data && data.count && data.count > pageSize && (
                <Stack spacing={2} sx={{ mt: 6, alignItems: 'center' }}>
                  <Pagination
                    count={Math.ceil((data.count || 0) / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Showing {(page - 1) * pageSize + 1} to{' '}
                    {Math.min(page * pageSize, data?.count || 0)} of {data?.count || 0} properties
                  </Typography>
                </Stack>
              )}
            </>
          )}

          {/* Empty State */}
          {!showMap && data && data.results && data.results.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: theme.palette.text.primary }}>
                No properties found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                Try adjusting your filters or search criteria
              </Typography>
              <Button variant="outlined" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </Box>
          )}
      </Box>
    </Container>
  );
}
