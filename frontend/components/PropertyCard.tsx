'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Home,
  Bed,
  Bathtub,
  SquareFoot,
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Elevator,
  Balcony,
  LocalParking,
} from '@mui/icons-material';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const theme = useTheme();
  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatPricePerSqm = () => {
    const price = parseFloat(property.price);
    const size = parseFloat(property.size_sqm);
    if (size > 0) {
      return formatPrice(price / size);
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

  const getPropertyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      apartment: '#1976d2',
      house: '#2e7d32',
      land: '#ed6c02',
      commercial: '#9c27b0',
      mixed: '#d32f2f',
    };
    return colors[type] || '#666';
  };

  const images = property.images && property.images.length > 0 ? property.images : [];
  const hasMultipleImages = images.length > 1;

  const handleImageNavigation = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (direction === 'prev') {
      setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const currentImage = images[imageIndex] || null;

  return (
    <Card
      component={Link}
      href={`/properties/${property.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        textDecoration: 'none',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          '& .property-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          height: 240,
          overflow: 'hidden',
          backgroundColor: theme.palette.grey[200],
        }}
      >
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        {currentImage && !imageError ? (
          <CardMedia
            component="img"
            image={currentImage}
            alt={property.address}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              display: imageLoading ? 'none' : 'block',
            }}
            className="property-image"
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[300],
            }}
          >
            <Home sx={{ fontSize: 64, color: theme.palette.grey[500] }} />
          </Box>
        )}

        {/* Image Navigation */}
        {hasMultipleImages && currentImage && !imageError && (
          <>
            <IconButton
              onClick={(e) => handleImageNavigation('prev', e)}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
                opacity: 0,
                transition: 'opacity 0.2s',
                '.MuiCard-root:hover &': {
                  opacity: 1,
                },
              }}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={(e) => handleImageNavigation('next', e)}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
                opacity: 0,
                transition: 'opacity 0.2s',
                '.MuiCard-root:hover &': {
                  opacity: 1,
                },
              }}
              size="small"
            >
              <ChevronRight />
            </IconButton>
            {/* Image Indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.5,
              }}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: index === imageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'background-color 0.2s',
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Property Type Badge */}
        <Chip
          label={getPropertyTypeLabel(property.property_type)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: getPropertyTypeColor(property.property_type),
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          '&:last-child': {
            pb: 2.5,
          },
        }}
      >
        {/* Price */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              fontSize: '1.5rem',
              lineHeight: 1.2,
            }}
          >
            {formatPrice(property.price)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              mt: 0.5,
              display: 'block',
            }}
          >
            {formatPricePerSqm()} / m²
          </Typography>
        </Box>

        {/* Address */}
        <Box sx={{ mb: 1.5, minHeight: 40 }}>
          <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mb: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.25 }} />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                lineHeight: 1.4,
                flex: 1,
              }}
            >
              {property.address}
            </Typography>
          </Stack>
          {property.region && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                ml: 2.5,
                fontSize: '0.7rem',
              }}
            >
              {property.region.name}
            </Typography>
          )}
        </Box>

        {/* Features */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 'auto',
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          {property.bedrooms !== null && property.bedrooms !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Bed sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {property.bedrooms}
              </Typography>
            </Box>
          )}
          {property.bathrooms && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Bathtub sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {property.bathrooms}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            <SquareFoot sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              {property.size_sqm} m²
            </Typography>
          </Box>
        </Stack>

        {/* Additional Features */}
        {(property.has_elevator || property.has_balcony || property.has_terrace || (property.parking_spaces && property.parking_spaces > 0)) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {property.has_elevator && (
              <Chip
                icon={<Elevator sx={{ fontSize: 16 }} />}
                label="Elevator"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
            {property.has_balcony && (
              <Chip
                icon={<Balcony sx={{ fontSize: 16 }} />}
                label="Balcony"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
            {property.has_terrace && (
              <Chip
                icon={<Balcony sx={{ fontSize: 16 }} />}
                label="Terrace"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
            {property.parking_spaces && property.parking_spaces > 0 && (
              <Chip
                icon={<LocalParking sx={{ fontSize: 16 }} />}
                label={`${property.parking_spaces} Parking`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 24 }}
              />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
