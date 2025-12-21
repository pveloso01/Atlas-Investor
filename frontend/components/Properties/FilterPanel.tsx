'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Collapse,
  Button,
  Chip,
  Stack,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid,
  Popover,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { PropertyListParams } from '@/lib/store/api/propertyApi';
import GeographicFilter from './GeographicFilter';

interface FilterPanelProps {
  filters: PropertyListParams;
  onFiltersChange: (filters: PropertyListParams) => void;
  onReset: () => void;
}

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
};

export default function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const [propertyDetailsOpen, setPropertyDetailsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [geographicOpen, setGeographicOpen] = useState(false);
  const [priceRangeAnchor, setPriceRangeAnchor] = useState<HTMLButtonElement | null>(null);
  const [sizeRangeAnchor, setSizeRangeAnchor] = useState<HTMLButtonElement | null>(null);
  const [bedroomsAnchor, setBedroomsAnchor] = useState<HTMLButtonElement | null>(null);
  const [bathroomsAnchor, setBathroomsAnchor] = useState<HTMLButtonElement | null>(null);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    const propertyTypes = Array.isArray(filters.property_type) ? filters.property_type : (filters.property_type ? [filters.property_type] : []);
    if (propertyTypes.length > 0) count++;
    if (filters.min_price && filters.min_price > defaultFilters.min_price!) count++;
    if (filters.max_price && filters.max_price < defaultFilters.max_price!) count++;
    if (filters.min_size && filters.min_size > defaultFilters.min_size!) count++;
    if (filters.max_size && filters.max_size < defaultFilters.max_size!) count++;
    if (filters.min_bedrooms && filters.min_bedrooms > defaultFilters.min_bedrooms!) count++;
    if (filters.max_bedrooms && filters.max_bedrooms < defaultFilters.max_bedrooms!) count++;
    if (filters.min_bathrooms && filters.min_bathrooms > defaultFilters.min_bathrooms!) count++;
    if (filters.max_bathrooms && filters.max_bathrooms < defaultFilters.max_bathrooms!) count++;
    if (filters.min_year_built && filters.min_year_built > defaultFilters.min_year_built!) count++;
    if (filters.max_year_built && filters.max_year_built < defaultFilters.max_year_built!) count++;
    const conditions = Array.isArray(filters.condition) ? filters.condition : (filters.condition ? [filters.condition] : []);
    if (conditions.length > 0) count++;
    const energyRatings = Array.isArray(filters.energy_rating) ? filters.energy_rating : (filters.energy_rating ? [filters.energy_rating] : []);
    if (energyRatings.length > 0) count++;
    if (filters.has_elevator !== undefined) count++;
    if (filters.has_balcony !== undefined) count++;
    if (filters.has_terrace !== undefined) count++;
    if (filters.min_parking_spaces && filters.min_parking_spaces > defaultFilters.min_parking_spaces!) count++;
    const listingStatuses = Array.isArray(filters.listing_status) ? filters.listing_status : (filters.listing_status ? [filters.listing_status] : []);
    if (listingStatuses.length > 0) count++;
    return count;
  }, [filters]);

  const handleFilterChange = (key: keyof PropertyListParams, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onReset();
  };

  const getPriceRangeText = () => {
    const min = filters.min_price || 0;
    const max = filters.max_price || 2000000;
    if (min === 0 && max === 2000000) return 'Price';
    return `€${(min / 1000).toFixed(0)}k - €${(max / 1000).toFixed(0)}k`;
  };

  const getSizeRangeText = () => {
    const min = filters.min_size || 0;
    const max = filters.max_size || 1000;
    if (min === 0 && max === 1000) return 'Size';
    return `${min} - ${max} m²`;
  };

  const getBedroomsText = () => {
    const min = filters.min_bedrooms || 0;
    const max = filters.max_bedrooms || 10;
    if (min === 0 && max === 10) return 'Bedrooms';
    return `${min} - ${max} beds`;
  };

  const getBathroomsText = () => {
    const min = filters.min_bathrooms || 0;
    const max = filters.max_bathrooms || 10;
    if (min === 0 && max === 10) return 'Bathrooms';
    return `${min} - ${max} baths`;
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${colors.neutral.gray200}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral.gray700 }}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              color="primary"
              sx={{ ml: 1, minWidth: 24, height: 24, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        {activeFilterCount > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleReset}
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Horizontal Filter Row */}
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search"
            placeholder="Address, city..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>

        {/* Property Type - Multiselect */}
        <Grid item xs={6} sm={3} md={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              multiple
              value={Array.isArray(filters.property_type) ? filters.property_type : (filters.property_type ? [filters.property_type] : [])}
              label="Type"
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange('property_type', typeof value === 'string' ? value.split(',') : value);
              }}
              renderValue={(selected) => {
                if (selected.length === 0) return 'All';
                if (selected.length === 1) return selected[0];
                return `${selected.length} selected`;
              }}
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Price Range */}
        <Grid item xs={6} sm={3} md={2}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={(e) => setPriceRangeAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', justifyContent: 'space-between' }}
          >
            {getPriceRangeText()}
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          </Button>
          <Popover
            open={Boolean(priceRangeAnchor)}
            anchorEl={priceRangeAnchor}
            onClose={() => setPriceRangeAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, minWidth: 300 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Price Range
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.neutral.gray600 }}>
                €{(filters.min_price || 0).toLocaleString()} - €{(filters.max_price || 2000000).toLocaleString()}
              </Typography>
              <Slider
                value={[filters.min_price || 0, filters.max_price || 2000000]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('min_price', min);
                  handleFilterChange('max_price', max);
                }}
                min={0}
                max={2000000}
                step={10000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value.toLocaleString()}`}
              />
            </Box>
          </Popover>
        </Grid>

        {/* Size Range */}
        <Grid item xs={6} sm={3} md={2}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={(e) => setSizeRangeAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', justifyContent: 'space-between' }}
          >
            {getSizeRangeText()}
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          </Button>
          <Popover
            open={Boolean(sizeRangeAnchor)}
            anchorEl={sizeRangeAnchor}
            onClose={() => setSizeRangeAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, minWidth: 300 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Size Range
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.neutral.gray600 }}>
                {(filters.min_size || 0)} - {(filters.max_size || 1000)} m²
              </Typography>
              <Slider
                value={[filters.min_size || 0, filters.max_size || 1000]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('min_size', min);
                  handleFilterChange('max_size', max);
                }}
                min={0}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} m²`}
              />
            </Box>
          </Popover>
        </Grid>

        {/* Bedrooms */}
        <Grid item xs={6} sm={3} md={1.5}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={(e) => setBedroomsAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', justifyContent: 'space-between' }}
          >
            {getBedroomsText()}
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          </Button>
          <Popover
            open={Boolean(bedroomsAnchor)}
            anchorEl={bedroomsAnchor}
            onClose={() => setBedroomsAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, minWidth: 250 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Bedrooms
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.neutral.gray600 }}>
                {(filters.min_bedrooms || 0)} - {(filters.max_bedrooms || 10)}
              </Typography>
              <Slider
                value={[filters.min_bedrooms || 0, filters.max_bedrooms || 10]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('min_bedrooms', min);
                  handleFilterChange('max_bedrooms', max);
                }}
                min={0}
                max={10}
                step={1}
                valueLabelDisplay="auto"
                marks
              />
            </Box>
          </Popover>
        </Grid>

        {/* Bathrooms */}
        <Grid item xs={6} sm={3} md={1.5}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={(e) => setBathroomsAnchor(e.currentTarget)}
            sx={{ textTransform: 'none', justifyContent: 'space-between' }}
          >
            {getBathroomsText()}
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          </Button>
          <Popover
            open={Boolean(bathroomsAnchor)}
            anchorEl={bathroomsAnchor}
            onClose={() => setBathroomsAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, minWidth: 250 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Bathrooms
              </Typography>
              <Typography variant="caption" sx={{ mb: 2, display: 'block', color: colors.neutral.gray600 }}>
                {(filters.min_bathrooms || 0)} - {(filters.max_bathrooms || 10)}
              </Typography>
              <Slider
                value={[filters.min_bathrooms || 0, filters.max_bathrooms || 10]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('min_bathrooms', min);
                  handleFilterChange('max_bathrooms', max);
                }}
                min={0}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
                marks
              />
            </Box>
          </Popover>
        </Grid>

        {/* More Filters Button */}
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => {
              setPropertyDetailsOpen(!propertyDetailsOpen);
              setFeaturesOpen(!featuresOpen);
              setGeographicOpen(!geographicOpen);
            }}
            endIcon={propertyDetailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textTransform: 'none' }}
          >
            More Filters
          </Button>
        </Grid>
      </Grid>

      {/* Expanded Filters */}
      <Collapse in={propertyDetailsOpen || featuresOpen || geographicOpen}>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          {/* Geographic Filter */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: colors.neutral.gray700 }}>
                Location
              </Typography>
              <GeographicFilter
                district={Array.isArray((filters as any).district) ? (filters as any).district : ((filters as any).district ? [(filters as any).district] : [])}
                municipality={Array.isArray((filters as any).municipality) ? (filters as any).municipality : ((filters as any).municipality ? [(filters as any).municipality] : [])}
                parish={Array.isArray((filters as any).parish) ? (filters as any).parish : ((filters as any).parish ? [(filters as any).parish] : [])}
                onDistrictChange={(value) => {
                  const districtsArray = Array.isArray(value) ? value : (value ? [value] : []);
                  handleFilterChange('district' as any, districtsArray);
                }}
                onMunicipalityChange={(value) => {
                  const municipalitiesArray = Array.isArray(value) ? value : (value ? [value] : []);
                  handleFilterChange('municipality' as any, municipalitiesArray.length > 0 ? municipalitiesArray : []);
                }}
                onParishChange={(value) => {
                  const parishesArray = Array.isArray(value) ? value : (value ? [value] : []);
                  handleFilterChange('parish' as any, parishesArray.length > 0 ? parishesArray : []);
                }}
                onSearchChange={(searchTerm) => {
                  if (searchTerm) {
                    handleFilterChange('search', searchTerm);
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Property Details */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: colors.neutral.gray700 }}>
                Property Details
              </Typography>
              <Stack spacing={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(filters.condition) ? filters.condition : (filters.condition ? [filters.condition] : [])}
                    label="Condition"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('condition', typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) return 'All';
                      if (selected.length === 1) return selected[0];
                      return `${selected.length} selected`;
                    }}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="excellent">Excellent</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="needs_renovation">Needs Renovation</MenuItem>
                    <MenuItem value="demolition">Demolition</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Energy Rating</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(filters.energy_rating) ? filters.energy_rating : (filters.energy_rating ? [filters.energy_rating] : [])}
                    label="Energy Rating"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('energy_rating', typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) return 'All';
                      if (selected.length === 1) return selected[0];
                      return `${selected.length} selected`;
                    }}
                  >
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                    <MenuItem value="F">F</MenuItem>
                    <MenuItem value="G">G</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(filters.listing_status) ? filters.listing_status : (filters.listing_status ? [filters.listing_status] : [])}
                    label="Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('listing_status', typeof value === 'string' ? value.split(',') : value);
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) return 'All';
                      if (selected.length === 1) return selected[0];
                      return `${selected.length} selected`;
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="sold">Sold</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="withdrawn">Withdrawn</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Grid>

          {/* Features */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: colors.neutral.gray700 }}>
                Features
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_elevator === true}
                      onChange={(e) =>
                        handleFilterChange('has_elevator', e.target.checked ? true : undefined)
                      }
                      size="small"
                    />
                  }
                  label="Elevator"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_balcony === true}
                      onChange={(e) =>
                        handleFilterChange('has_balcony', e.target.checked ? true : undefined)
                      }
                      size="small"
                    />
                  }
                  label="Balcony"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_terrace === true}
                      onChange={(e) =>
                        handleFilterChange('has_terrace', e.target.checked ? true : undefined)
                      }
                      size="small"
                    />
                  }
                  label="Terrace"
                />
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: colors.neutral.gray600 }}>
                    Min Parking: {filters.min_parking_spaces || 0}
                  </Typography>
                  <Slider
                    value={filters.min_parking_spaces || 0}
                    onChange={(_, newValue) => handleFilterChange('min_parking_spaces', newValue as number)}
                    min={0}
                    max={10}
                    step={1}
                    size="small"
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
}
