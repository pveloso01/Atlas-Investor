import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
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
import { ViewList, ViewModule, Map as MapIcon, List as ListIcon } from '@mui/icons-material';
import { useGetPropertiesQuery } from '../store/api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import { Property } from '../types/property';

type ViewMode = 'grid' | 'list';

const PropertiesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [propertyType, setPropertyType] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Properties
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
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
        <Box sx={{ flexGrow: 1 }} />
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load properties. Please try again later.
        </Alert>
      )}

      {/* Map View */}
      {showMap && data && (
        <Box sx={{ mb: 4 }}>
          <PropertyMap
            properties={data.results}
            onPropertyClick={(property) => {
              setSelectedProperty(property);
              setModalOpen(true);
            }}
            height={600}
          />
        </Box>
      )}

      {/* Properties Grid/List */}
      {!showMap && data && data.results.length > 0 && (
        <>
          <Grid container spacing={3}>
            {data.results.map((property: Property) => (
              <Grid
                item
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                md={viewMode === 'grid' ? 4 : 12}
                lg={viewMode === 'grid' ? 3 : 12}
                key={property.id}
              >
                <PropertyCard
                  property={property}
                  onClick={() => {
                    setSelectedProperty(property);
                    setModalOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {data.count > pageSize && (
            <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
              <Pagination
                count={Math.ceil(data.count / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {Math.min(page * pageSize, data.count)} of {data.count} properties
              </Typography>
            </Stack>
          )}
        </>
      )}

      {/* Empty State */}
      {!showMap && data && data.results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No properties found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters
          </Typography>
        </Box>
      )}

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </Container>
  );
};

export default PropertiesPage;
