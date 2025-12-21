'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  AccountBalanceWallet as PortfolioIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

const navItems = [
  { label: 'Find Deals', href: '/properties', icon: SearchIcon },
  { label: 'Analyze Markets', href: '/dashboard', icon: AnalyticsIcon },
  { label: 'My Portfolio', href: '/portfolio', icon: PortfolioIcon },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', pt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: colors.primary.main }}>
        Atlas Investor
      </Typography>
      <List>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: colors.primary.light + '20',
                    color: colors.primary.main,
                  },
                }}
              >
                <Icon sx={{ mr: 1, fontSize: 20 }} />
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/login">
            <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mt: 2, px: 2 }}>
          <Button
            fullWidth
            variant="contained"
            href="/register"
            component={Link}
            sx={{
              backgroundColor: colors.accent.main,
              '&:hover': {
                backgroundColor: colors.accent.dark,
              },
            }}
          >
            Start Free Trial
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: colors.neutral.white,
          borderBottom: `1px solid ${colors.neutral.gray200}`,
          color: colors.neutral.gray900,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: colors.primary.main,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              Atlas Investor
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.label}
                    component={Link}
                    href={item.href}
                    startIcon={<Icon />}
                    sx={{
                      color: isActive ? colors.primary.main : colors.neutral.gray700,
                      fontWeight: isActive ? 600 : 400,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: colors.neutral.gray100,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                <Button
                  component={Link}
                  href="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: colors.neutral.gray700,
                    textTransform: 'none',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  href="/register"
                  component={Link}
                  sx={{
                    backgroundColor: colors.accent.main,
                    color: colors.neutral.white,
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      backgroundColor: colors.accent.dark,
                    },
                  }}
                >
                  Start Free Trial
                </Button>
              </>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
