'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Chip,
  Checkbox,
  Tabs,
  Tab,
} from '@mui/material';
import { Delete, OpenInNew, Euro, SquareFoot, Compare } from '@mui/icons-material';
import { useGetCurrentUserQuery } from '@/lib/store/api/authApi';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { colors } from '@/lib/theme/colors';
import PropertyComparisonTable from '@/components/Comparison/PropertyComparisonTable';

// Placeholder for saved properties - in production this would come from the API
const mockSavedProperties = [
  {
    id: 1,
    property: {
      id: 1,
      address: 'Rua Augusta 145, Baixa, Lisboa',
      price: '650000',
      size_sqm: '120',
      property_type: 'apartment',
      bedrooms: 3,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    },
    notes: 'Great location, need to check renovation costs',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    property: {
      id: 2,
      address: 'Rua das Flores 125, Porto',
      price: '380000',
      size_sqm: '95',
      property_type: 'apartment',
      bedrooms: 2,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    },
    notes: 'Good rental potential',
    created_at: '2024-01-10',
  },
];

export default function SavedPropertiesPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

  const toggleComparison = (propertyId: number) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 4) {
        return prev; // Max 4 properties for comparison
      }
      return [...prev, propertyId];
    });
  };

  const handleRemoveFromComparison = (propertyId: number) => {
    setSelectedForComparison((prev) => prev.filter((id) => id !== propertyId));
  };

  const comparisonProperties = mockSavedProperties
    .filter((saved) => selectedForComparison.includes(saved.property.id))
    .map((saved) => saved.property);

  const formatPrice = (price: string) => {
    return `€${parseInt(price).toLocaleString('pt-PT')}`;
  };

  if (userLoading) {
    return (
      <ProtectedRoute>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          My Saved Properties
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray600 }}>
          {mockSavedProperties.length} properties saved
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="My Properties" />
          <Tab
            label={`Compare (${selectedForComparison.length})`}
            disabled={selectedForComparison.length < 2}
          />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <>
          {selectedForComparison.length > 0 && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: colors.primary.light + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Compare sx={{ color: colors.primary.main }} />
                <Typography>
                  {selectedForComparison.length} properties selected for comparison
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                disabled={selectedForComparison.length < 2}
                onClick={() => setSelectedTab(1)}
                sx={{
                  backgroundColor: colors.primary.main,
                  '&:hover': { backgroundColor: colors.primary.dark },
                }}
              >
                Compare Now
              </Button>
            </Paper>
          )}

          <Grid container spacing={3}>
            {mockSavedProperties.map((saved) => (
              <Grid size={{ xs: 12, md: 6 }} key={saved.id}>
                <Card
                  sx={{
                    display: 'flex',
                    height: '100%',
                    border: selectedForComparison.includes(saved.property.id)
                      ? `2px solid ${colors.primary.main}`
                      : 'none',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Checkbox
                      checked={selectedForComparison.includes(saved.property.id)}
                      onChange={() => toggleComparison(saved.property.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderRadius: 1,
                      }}
                    />
                    <CardMedia
                      component="img"
                      sx={{ width: 200, objectFit: 'cover' }}
                      image={saved.property.images[0]}
                      alt={saved.property.address}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {saved.property.address}
                        </Typography>
                        <Chip
                          label={saved.property.property_type}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Euro fontSize="small" sx={{ color: colors.primary.main }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatPrice(saved.property.price)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SquareFoot fontSize="small" sx={{ color: colors.neutral.gray600 }} />
                          <Typography variant="body2">{saved.property.size_sqm} m²</Typography>
                        </Box>
                      </Box>

                      {saved.notes && (
                        <Paper sx={{ p: 1.5, bgcolor: colors.neutral.gray100, mt: 1 }}>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            Note: {saved.notes}
                          </Typography>
                        </Paper>
                      )}
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<OpenInNew />}
                        onClick={() => router.push(`/properties/${saved.property.id}`)}
                      >
                        View Details
                      </Button>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedTab === 1 && (
        <PropertyComparisonTable
          properties={comparisonProperties}
          onRemove={handleRemoveFromComparison}
          onViewDetails={(id) => router.push(`/properties/${id}`)}
        />
      )}

      {mockSavedProperties.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No saved properties yet
          </Typography>
          <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 2 }}>
            Browse properties and save the ones you are interested in
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboard')}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
            }}
          >
            Browse Properties
          </Button>
        </Paper>
      )}
      </Container>
    </ProtectedRoute>
  );
}

