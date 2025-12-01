'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import { ViewList, ViewModule, Map as MapIcon } from '@mui/icons-material';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/PropertyMap';
import { useRouter } from 'next/navigation';

type ViewMode = 'grid' | 'list';

export default function PropertiesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [propertyType, setPropertyType] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [showMap, setShowMap] = useState(false);

  const { data, error, isLoading } = useGetPropertiesQuery({
    page,
    page_size: pageSize,
    property_type: propertyType || undefined,
    region: region ? parseInt(region) : undefined,
    search: search || undefined,
    ordering: '-created_at',
  });

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

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" component="h1" className="mb-4">
        Properties
      </Typography>

      {/* Filters */}
      <Box className="mb-8 flex gap-4 flex-wrap items-center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="min-w-[200px]"
        />
        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Property Type</InputLabel>
          <Select
            value={propertyType}
            label="Property Type"
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="land">Land</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="mixed">Mixed Use</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Region</InputLabel>
          <Select
            value={region}
            label="Region"
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Regions</MenuItem>
            <MenuItem value="1">Lisbon</MenuItem>
            <MenuItem value="2">Porto</MenuItem>
            <MenuItem value="3">Cascais</MenuItem>
          </Select>
        </FormControl>
        <Box className="flex-grow" />
        <Button
          variant={showMap ? 'contained' : 'outlined'}
          startIcon={<MapIcon />}
          onClick={() => setShowMap(!showMap)}
          size="small"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
        {!showMap && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
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

      {/* Loading State */}
      {isLoading && (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" className="mb-8">
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
        <Box className="mb-8">
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
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </Box>

          {/* Pagination */}
          {data && data.count && data.count > pageSize && (
            <Stack spacing={2} className="mt-8 items-center">
              <Pagination
                count={Math.ceil((data.count || 0) / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
              <Typography variant="body2" className="text-gray-600">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {Math.min(page * pageSize, data?.count || 0)} of {data?.count || 0} properties
              </Typography>
            </Stack>
          )}
        </>
      )}

      {/* Empty State */}
      {!showMap && data && data.results && data.results.length === 0 && (
        <Box className="text-center py-16">
          <Typography variant="h6" className="text-gray-600">
            No properties found
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-2">
            Try adjusting your filters
          </Typography>
        </Box>
      )}
    </Container>
  );
}


