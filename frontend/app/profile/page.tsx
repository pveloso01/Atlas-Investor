'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Person, Bookmark, Assessment, Settings, Logout } from '@mui/icons-material';
import { useGetCurrentUserQuery, useLogoutMutation } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to view your profile
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/login')}
          sx={{
            mt: 2,
            backgroundColor: colors.primary.main,
            '&:hover': { backgroundColor: colors.primary.dark },
          }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: colors.primary.main,
              fontSize: '2rem',
            }}
          >
            {user.first_name?.[0] || user.email[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body1" sx={{ color: colors.neutral.gray600 }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Bookmark />}
              onClick={() => router.push('/saved')}
              sx={{ py: 2, justifyContent: 'flex-start' }}
            >
              My Saved Properties
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => router.push('/dashboard')}
              sx={{ py: 2, justifyContent: 'flex-start' }}
            >
              Deal Finder Dashboard
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Settings />}
              sx={{ py: 2, justifyContent: 'flex-start' }}
            >
              Account Settings
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ py: 2, justifyContent: 'flex-start' }}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Person sx={{ color: colors.primary.main }} />
          <Typography variant="h6">Account Information</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              First Name
            </Typography>
            <Typography variant="body1">{user.first_name || 'Not set'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Last Name
            </Typography>
            <Typography variant="body1">{user.last_name || 'Not set'}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
              Email
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

