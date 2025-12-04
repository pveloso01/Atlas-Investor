'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { Property } from '@/types/property';
import { colors } from '@/lib/theme/colors';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  selectedPropertyId?: number | null;
  height?: string | number;
}

// Color coding by property type
const getMarkerColor = (propertyType: string): string => {
  const colorMap: Record<string, string> = {
    apartment: colors.primary.main,
    house: colors.success.main,
    land: colors.warning.main,
    commercial: colors.info.main,
    mixed: colors.accent.main,
  };
  return colorMap[propertyType] || colors.primary.main;
};

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertyClick,
  selectedPropertyId,
  height = 600,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [mapError] = useState<string | null>(
    mapboxToken ? null : 'Mapbox access token is not configured'
  );

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) {
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // Use a muted style for brand alignment
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-9.1393, 38.7223], // Lisbon center
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        'top-right'
      );
    }

    // Clean up markers and popups
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      if (!property.coordinates || property.coordinates.length !== 2) return;

      const [lng, lat] = property.coordinates;
      const isSelected = selectedPropertyId === property.id;
      const markerColor = getMarkerColor(property.property_type);

      // Create popup content with better styling
      const popupContent = document.createElement('div');
      popupContent.style.cssText = `
        padding: 12px;
        min-width: 200px;
        font-family: Inter, Arial, sans-serif;
      `;
      popupContent.innerHTML = `
        <div style="font-weight: 600; font-size: 16px; color: ${colors.primary.main}; margin-bottom: 6px;">
          ${new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          }).format(parseFloat(property.price))}
        </div>
        <div style="font-size: 13px; color: ${colors.neutral.gray700}; margin-bottom: 4px;">
          ${property.address}
        </div>
        <div style="font-size: 11px; color: ${colors.neutral.gray500};">
          ${property.bedrooms ? `${property.bedrooms} bed` : ''} 
          ${property.bathrooms ? `· ${property.bathrooms} bath` : ''} 
          · ${property.size_sqm} m²
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setDOMContent(popupContent);

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: ${isSelected ? '32px' : '24px'};
        height: ${isSelected ? '32px' : '24px'};
        border-radius: 50%;
        background-color: ${markerColor};
        border: 3px solid ${isSelected ? colors.accent.main : colors.neutral.white};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      `;

      // Create marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
        if (!popup.isOpen()) {
          popup.addTo(map.current!);
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        if (popup.isOpen() && !isSelected) {
          popup.remove();
        }
      });

      // Click handler
      if (onPropertyClick) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onPropertyClick(property);
        });
      }

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markersRef.current.forEach((marker) => {
        const lngLat = marker.getLngLat();
        bounds.extend([lngLat.lng, lngLat.lat]);
      });
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
      });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      popupsRef.current.forEach((popup) => popup.remove());
    };
  }, [properties, onPropertyClick, selectedPropertyId, mapboxToken]);

  if (!mapboxToken) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height }}>
        <Typography variant="body1" color="text.secondary">
          Mapbox access token is not configured. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your
          environment variables.
        </Typography>
      </Paper>
    );
  }

  if (mapError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height }}>
        <Typography variant="body1" color="error">
          {mapError}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      ref={mapContainer}
      sx={{
        width: '100%',
        height,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    />
  );
};

export default PropertyMap;

