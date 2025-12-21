'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  AccountTree as TreeIcon,
} from '@mui/icons-material';
import {
  allTopLevelLocations,
  allLocationsFlat,
  searchLocations,
  getChildren,
  GeographicLocation,
  GeographicType,
} from '@/data/portugal-geography';

type FilterMode = 'hierarchical' | 'searchable';

interface GeographicFilterProps {
  district?: string | string[];
  municipality?: string | string[];
  parish?: string | string[];
  onDistrictChange: (value: string | string[]) => void;
  onMunicipalityChange: (value: string | string[]) => void;
  onParishChange: (value: string | string[]) => void;
  onLocationChange?: (location: GeographicLocation | null) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export default function GeographicFilter({
  district,
  municipality,
  parish,
  onDistrictChange,
  onMunicipalityChange,
  onParishChange,
  onLocationChange,
  onSearchChange,
}: GeographicFilterProps) {
  const [mode, setMode] = useState<FilterMode>('hierarchical');
  const [searchValue, setSearchValue] = useState<GeographicLocation | null>(null);


  // Get available municipalities based on selected districts
  const availableMunicipalities = useMemo(() => {
    const selectedDistricts = Array.isArray(district) ? district : (district ? [district] : []);
    if (selectedDistricts.length === 0) return [];
    
    const municipalities: GeographicLocation[] = [];
    
    // Search through the hierarchical structure
    selectedDistricts.forEach((distId) => {
      // Find the district in the top-level locations
      const districtLocation = allTopLevelLocations.find(
        (loc) => loc.id === distId && (loc.type === 'district' || loc.type === 'autonomous_region')
      );
      
      if (districtLocation) {
        // Check if district has children (municipalities)
        if (districtLocation.children && districtLocation.children.length > 0) {
          // Add all municipalities from this district
          municipalities.push(...districtLocation.children);
        }
        // If no children, the district might not have data yet
        // This is expected for districts that aren't fully populated
      }
    });
    
    // Remove duplicates based on id
    const uniqueMunicipalities = municipalities.filter((mun, index, self) =>
      index === self.findIndex((m) => m.id === mun.id)
    );
    
    return uniqueMunicipalities;
  }, [district]);

  // Get available parishes based on selected municipalities
  const availableParishes = useMemo(() => {
    const selectedMunicipalities = Array.isArray(municipality) ? municipality : (municipality ? [municipality] : []);
    if (selectedMunicipalities.length === 0) return [];
    
    const parishes: GeographicLocation[] = [];
    
    // Find municipalities in the hierarchical structure
    selectedMunicipalities.forEach((munId) => {
      // Search through all districts to find the municipality
      for (const district of allTopLevelLocations) {
        if (district.children) {
          const municipalityLocation = district.children.find(
            (loc) => loc.id === munId && loc.type === 'municipality'
          );
          if (municipalityLocation?.children && municipalityLocation.children.length > 0) {
            // Add all parishes from this municipality
            parishes.push(...municipalityLocation.children);
            break; // Found it, move to next municipality
          }
        }
      }
    });
    
    // Remove duplicates based on id
    const uniqueParishes = parishes.filter((par, index, self) =>
      index === self.findIndex((p) => p.id === par.id)
    );
    
    return uniqueParishes;
  }, [municipality]);

  // Get districts and autonomous regions for hierarchical mode
  const districtsAndRegions = useMemo(() => {
    return allTopLevelLocations.filter(
      (loc) => loc.type === 'district' || loc.type === 'autonomous_region'
    );
  }, []);

  // Handle hierarchical mode changes
  const handleDistrictChange = (value: string | string[]) => {
    const districtsArray = Array.isArray(value) ? value : (value ? [value] : []);
    onDistrictChange(districtsArray);
    // Reset municipality and parish when district changes
    onMunicipalityChange([]);
    onParishChange([]);
  };

  const handleMunicipalityChange = (value: string | string[]) => {
    const municipalitiesArray = Array.isArray(value) ? value : (value ? [value] : []);
    onMunicipalityChange(municipalitiesArray.length > 0 ? municipalitiesArray : []);
    // Reset parish when municipality changes
    onParishChange([]);
  };

  // Handle searchable mode changes
  const handleSearchChange = (_event: unknown, newValue: GeographicLocation | null) => {
    setSearchValue(newValue);
    if (newValue) {
      // Extract district, municipality, and parish from the selected location
      const pathParts = newValue.fullPath.split(' > ');
      
      if (newValue.type === 'district' || newValue.type === 'autonomous_region') {
        const currentDistricts = Array.isArray(district) ? district : (district ? [district] : []);
        if (!currentDistricts.includes(newValue.id)) {
          onDistrictChange([...currentDistricts, newValue.id]);
        }
        onMunicipalityChange([]);
        onParishChange([]);
      } else if (newValue.type === 'municipality') {
        // Find parent district
        const parent = allLocationsFlat.find((loc) => 
          loc.children?.some((child) => child.id === newValue.id)
        );
        if (parent) {
          const currentDistricts = Array.isArray(district) ? district : (district ? [district] : []);
          if (!currentDistricts.includes(parent.id)) {
            onDistrictChange([...currentDistricts, parent.id]);
          }
          const currentMunicipalities = Array.isArray(municipality) ? municipality : (municipality ? [municipality] : []);
          if (!currentMunicipalities.includes(newValue.id)) {
            onMunicipalityChange([...currentMunicipalities, newValue.id]);
          }
          onParishChange([]);
        }
      } else if (newValue.type === 'parish') {
        // Find parent municipality and district
        const parentMunicipality = allLocationsFlat.find((loc) => 
          loc.children?.some((child) => child.id === newValue.id)
        );
        if (parentMunicipality) {
          const parentDistrict = allLocationsFlat.find((loc) => 
            loc.children?.some((child) => child.id === parentMunicipality.id)
          );
          if (parentDistrict) {
            const currentDistricts = Array.isArray(district) ? district : (district ? [district] : []);
            if (!currentDistricts.includes(parentDistrict.id)) {
              onDistrictChange([...currentDistricts, parentDistrict.id]);
            }
            const currentMunicipalities = Array.isArray(municipality) ? municipality : (municipality ? [municipality] : []);
            if (!currentMunicipalities.includes(parentMunicipality.id)) {
              onMunicipalityChange([...currentMunicipalities, parentMunicipality.id]);
            }
            const currentParishes = Array.isArray(parish) ? parish : (parish ? [parish] : []);
            if (!currentParishes.includes(newValue.id)) {
              onParishChange([...currentParishes, newValue.id]);
            }
          }
        }
      }
      
      if (onLocationChange) {
        onLocationChange(newValue);
      }
      // Update search field with location name for address-based filtering
      if (onSearchChange) {
        onSearchChange(newValue.name);
      }
    } else {
      onDistrictChange([]);
      onMunicipalityChange([]);
      onParishChange([]);
      if (onLocationChange) {
        onLocationChange(null);
      }
      if (onSearchChange) {
        onSearchChange('');
      }
    }
  };

  return (
    <Box>
      {/* Mode Toggle */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
          Filter by:
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode !== null) {
              setMode(newMode);
              // Clear selections when switching modes
              if (newMode === 'hierarchical') {
                setSearchValue(null);
            } else {
              onDistrictChange([]);
              onMunicipalityChange([]);
              onParishChange([]);
            }
            }
          }}
          size="small"
        >
          <ToggleButton value="hierarchical" aria-label="hierarchical">
            <TreeIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Hierarchical
          </ToggleButton>
          <ToggleButton value="searchable" aria-label="searchable">
            <SearchIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Search
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === 'hierarchical' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* District/Autonomous Region Select - Multiselect */}
          <FormControl size="small" fullWidth>
            <InputLabel>District / Region</InputLabel>
            <Select
              key="district-select"
              multiple
              value={Array.isArray(district) ? district : (district ? [district] : [])}
              label="District / Region"
              onChange={(e) => {
                const value = e.target.value;
                // Material-UI Select with multiple always returns an array
                const selectedArray = Array.isArray(value) ? value : [];
                handleDistrictChange(selectedArray);
              }}
              renderValue={(selected) => {
                if (selected.length === 0) return 'All Districts / Regions';
                if (selected.length === 1) {
                  const loc = districtsAndRegions.find((l) => l.id === selected[0]);
                  return loc?.name || selected[0];
                }
                return `${selected.length} selected`;
              }}
            >
              {districtsAndRegions.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Municipality Select - Multiselect */}
          {(Array.isArray(district) ? district.length > 0 : district) && (
            <FormControl size="small" fullWidth>
              <InputLabel>Municipality</InputLabel>
              <Select
                multiple
                value={Array.isArray(municipality) ? municipality : (municipality ? [municipality] : [])}
                label="Municipality"
                onChange={(e) => {
                  const value = e.target.value;
                  // Material-UI Select with multiple always returns an array
                  const selectedArray = Array.isArray(value) ? value : [];
                  handleMunicipalityChange(selectedArray);
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    if (availableMunicipalities.length === 0) {
                      return 'No municipalities available';
                    }
                    return 'All Municipalities';
                  }
                  if (selected.length === 1) {
                    const mun = availableMunicipalities.find((m) => m.id === selected[0]);
                    return mun?.name || selected[0];
                  }
                  return `${selected.length} selected`;
                }}
                disabled={availableMunicipalities.length === 0}
              >
                {availableMunicipalities.length > 0 ? (
                  availableMunicipalities.map((mun) => (
                    <MenuItem key={mun.id} value={mun.id}>
                      {mun.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No municipalities available for selected districts
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          )}

          {/* Parish Select - Multiselect */}
          {(Array.isArray(municipality) ? municipality.length > 0 : municipality) && (
            <FormControl size="small" fullWidth>
              <InputLabel>Parish</InputLabel>
              <Select
                multiple
                value={Array.isArray(parish) ? parish : (parish ? [parish] : [])}
                label="Parish"
                onChange={(e) => {
                  const value = e.target.value;
                  // Material-UI Select with multiple always returns an array
                  const selectedArray = Array.isArray(value) ? value : [];
                  onParishChange(selectedArray);
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    if (availableParishes.length === 0) {
                      return 'No parishes available';
                    }
                    return 'All Parishes';
                  }
                  if (selected.length === 1) {
                    const par = availableParishes.find((p) => p.id === selected[0]);
                    return par?.name || selected[0];
                  }
                  return `${selected.length} selected`;
                }}
                disabled={availableParishes.length === 0}
              >
                {availableParishes.length > 0 ? (
                  availableParishes.map((par) => (
                    <MenuItem key={par.id} value={par.id}>
                      {par.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No parishes available for selected municipalities
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          )}
        </Box>
      ) : (
        <Autocomplete
          multiple
          options={allLocationsFlat}
          value={searchValue ? [searchValue] : []}
          onChange={(_, newValue) => {
            // Handle multiple selections
            if (Array.isArray(newValue) && newValue.length > 0) {
              const lastSelected = newValue[newValue.length - 1];
              setSearchValue(lastSelected);
              handleSearchChange(null, lastSelected);
            } else {
              setSearchValue(null);
              handleSearchChange(null, null);
            }
          }}
          getOptionLabel={(option) => option.fullPath}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Location"
              placeholder="Type to search districts, municipalities, or parishes..."
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box>
                <Typography variant="body2">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.fullPath}
                </Typography>
              </Box>
            </Box>
          )}
          groupBy={(option) => {
            // Group by type
            const typeLabels: Record<GeographicType, string> = {
              district: 'Districts',
              municipality: 'Municipalities',
              parish: 'Parishes',
              autonomous_region: 'Autonomous Regions',
            };
            return typeLabels[option.type] || 'Other';
          }}
          noOptionsText="No locations found"
          fullWidth
        />
      )}
    </Box>
  );
}

