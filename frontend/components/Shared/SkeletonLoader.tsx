'use client';

import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

/**
 * Skeleton loader for property cards
 */
export function PropertyCardSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={200} animation="wave" />
      
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="80%" height={28} animation="wave" sx={{ mb: 1 }} />
        
        {/* Location skeleton */}
        <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mb: 2 }} />
        
        {/* Features skeleton */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        </Box>
        
        {/* Price skeleton */}
        <Skeleton variant="text" width="40%" height={32} animation="wave" sx={{ mb: 1 }} />
        
        {/* Button skeleton */}
        <Skeleton variant="rounded" height={36} animation="wave" />
      </CardContent>
    </Card>
  );
}

/**
 * Grid of property card skeletons
 */
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <PropertyCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Skeleton for property detail page
 */
export function PropertyDetailSkeleton() {
  return (
    <Box>
      {/* Header */}
      <Skeleton variant="text" width="60%" height={40} animation="wave" sx={{ mb: 2 }} />
      <Skeleton variant="text" width="40%" height={24} animation="wave" sx={{ mb: 3 }} />
      
      <Grid container spacing={4}>
        {/* Main content */}
        <Grid item xs={12} lg={8}>
          {/* Image gallery skeleton */}
          <Skeleton variant="rectangular" height={400} animation="wave" sx={{ mb: 3, borderRadius: 2 }} />
          
          {/* Description skeleton */}
          <Skeleton variant="text" width="30%" height={32} animation="wave" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" sx={{ mb: 3 }} />
          
          {/* Features skeleton */}
          <Skeleton variant="text" width="25%" height={32} animation="wave" sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={6} sm={4} key={i}>
                <Skeleton variant="rounded" height={60} animation="wave" />
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Skeleton variant="rectangular" height={500} animation="wave" sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
      <Skeleton variant="circular" width={40} height={40} animation="wave" />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} animation="wave" />
        <Skeleton variant="text" width="40%" height={20} animation="wave" />
      </Box>
      <Skeleton variant="rounded" width={80} height={32} animation="wave" />
    </Box>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === 0 ? '30%' : '20%'}
          height={24}
          animation="wave"
        />
      ))}
    </Box>
  );
}

/**
 * Skeleton for dashboard stats cards
 */
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="50%" height={20} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={36} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={16} animation="wave" />
      </CardContent>
    </Card>
  );
}

