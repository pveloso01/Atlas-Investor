'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { Property } from '@/types/property';

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  height?: string | number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertyClick,
  height = 600,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) {
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setMapError('Mapbox access token is not configured');
      }, 0);
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-9.1393, 38.7223], // Lisbon center
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Clean up markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      if (!property.coordinates || property.coordinates.length !== 2) return;

      const [lng, lat] = property.coordinates;

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="padding: 8px;">
          <strong style="font-size: 14px; color: #1976d2;">${new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          }).format(parseFloat(property.price))}</strong>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">${property.address}</div>
          <div style="font-size: 11px; color: #999; margin-top: 2px;">
            ${property.bedrooms ? `${property.bedrooms} bed` : ''} 
            ${property.bathrooms ? `· ${property.bathrooms} bath` : ''} 
            · ${property.size_sqm} m²
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker({
        color: '#1976d2',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      if (onPropertyClick) {
        marker.getElement().addEventListener('click', () => {
          onPropertyClick(property);
        });
      }

      markersRef.current.push(marker);
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
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties, onPropertyClick, mapboxToken]);

  if (!mapboxToken) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height }}>
        <Typography variant="body1" color="text.secondary">
          Mapbox access token is not configured. Please set REACT_APP_MAPBOX_ACCESS_TOKEN in your
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
      }}
    />
  );
};

export default PropertyMap;

