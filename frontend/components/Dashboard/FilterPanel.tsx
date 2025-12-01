'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export interface FilterState {
  search: string;
  propertyType: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  minROI: number;
  maxROI: number;
  minYield: number;
  maxYield: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

const presetFilters = [
  { label: 'High ROI Deals', filters: { minROI: 10 } },
  { label: 'Development Opportunities', filters: { propertyType: 'land' } },
  { label: 'High Yield', filters: { minYield: 6 } },
];

export default function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
    setHasActiveFilters(
      newFilters.search !== '' ||
        newFilters.propertyType !== '' ||
        newFilters.region !== '' ||
        newFilters.minPrice > 0 ||
        newFilters.maxPrice < 1000000 ||
        newFilters.minROI > 0 ||
        newFilters.maxROI < 50 ||
        newFilters.minYield > 0 ||
        newFilters.maxYield < 20
    );
  };

  const handlePresetFilter = (preset: typeof presetFilters[0]) => {
    onFiltersChange({ ...filters, ...preset.filters });
    setHasActiveFilters(true);
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: `1px solid ${colors.neutral.gray200}`,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: colors.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={() => {
              onReset();
              setHasActiveFilters(false);
            }}
            sx={{ textTransform: 'none' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Preset Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: colors.neutral.gray600, mb: 1, display: 'block' }}>
          Quick Filters
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {presetFilters.map((preset, index) => (
            <Chip
              key={index}
              label={preset.label}
              onClick={() => handlePresetFilter(preset)}
              size="small"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: colors.primary.light + '20',
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Basic Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Search"
          placeholder="City, neighborhood, or property ID"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          size="small"
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={filters.propertyType}
              label="Property Type"
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="mixed">Mixed Use</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={filters.region}
              label="Region"
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <MenuItem value="">All Regions</MenuItem>
              <MenuItem value="1">Lisbon</MenuItem>
              <MenuItem value="2">Porto</MenuItem>
              <MenuItem value="3">Cascais</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Advanced Filters Toggle */}
      <Box>
        <Button
          fullWidth
          onClick={() => setAdvancedOpen(!advancedOpen)}
          endIcon={advancedOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            textTransform: 'none',
            color: colors.neutral.gray700,
            justifyContent: 'space-between',
            mb: advancedOpen ? 2 : 0,
          }}
        >
          Advanced Filters
        </Button>

        <Collapse in={advancedOpen}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Price Range */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Price Range: €{filters.minPrice.toLocaleString()} - €{filters.maxPrice.toLocaleString()}
              </Typography>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('minPrice', min);
                  handleFilterChange('maxPrice', max);
                }}
                min={0}
                max={2000000}
                step={10000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `€${value.toLocaleString()}`}
              />
            </Box>

            {/* ROI Range */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                ROI Range: {filters.minROI}% - {filters.maxROI}%
              </Typography>
              <Slider
                value={[filters.minROI, filters.maxROI]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('minROI', min);
                  handleFilterChange('maxROI', max);
                }}
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>

            {/* Yield Range */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: colors.neutral.gray700 }}>
                Yield Range: {filters.minYield}% - {filters.maxYield}%
              </Typography>
              <Slider
                value={[filters.minYield, filters.maxYield]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  handleFilterChange('minYield', min);
                  handleFilterChange('maxYield', max);
                }}
                min={0}
                max={20}
                step={0.5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}


