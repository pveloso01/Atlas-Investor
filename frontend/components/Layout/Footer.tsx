'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.neutral.gray900,
        color: colors.neutral.gray300,
        pt: 6,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Value Proposition */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.neutral.white,
                fontWeight: 700,
                mb: 2,
              }}
            >
              Atlas Investor
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              Discover and analyze the best property deals in Portugal. All the tools you need to
              make smarter real estate investment decisions in one platform.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colors.neutral.gray400, fontStyle: 'italic' }}
            >
              Data powered by Portuguese Government APIs, Idealista, and proprietary analysis
              algorithms.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.neutral.white, fontWeight: 600, mb: 2 }}
            >
              Platform
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <Link href="/properties" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText
                    primary="Find Deals"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/insights" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="Insights" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.neutral.white, fontWeight: 600, mb: 2 }}
            >
              Resources
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <Link href="/pricing" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="Pricing" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/security" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="Security" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/faq" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="FAQs" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/support" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="Support" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.neutral.white, fontWeight: 600, mb: 2 }}
            >
              Company
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText primary="About" primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  href="/about/methodology"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemText
                    primary="Methodology"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link href="/about/trust" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText
                    primary="Why Trust Us"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </Link>
              </ListItem>
            </List>
          </Grid>

          {/* Trust & Social */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: colors.neutral.white, fontWeight: 600, mb: 2 }}
            >
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton
                size="small"
                sx={{
                  color: colors.neutral.gray400,
                  '&:hover': { color: colors.primary.light },
                }}
                aria-label="Facebook"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: colors.neutral.gray400,
                  '&:hover': { color: colors.primary.light },
                }}
                aria-label="Twitter"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: colors.neutral.gray400,
                  '&:hover': { color: colors.primary.light },
                }}
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Trust Badges */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SecurityIcon sx={{ fontSize: 16, color: colors.success.main }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  SSL Encrypted
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUserIcon sx={{ fontSize: 16, color: colors.success.main }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  GDPR Compliant
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: colors.neutral.gray700 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.neutral.gray500 }}>
            © {new Date().getFullYear()} Atlas Investor. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" style={{ textDecoration: 'none', color: colors.neutral.gray400 }}>
              <Typography variant="caption">Privacy Policy</Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none', color: colors.neutral.gray400 }}>
              <Typography variant="caption">Terms of Service</Typography>
            </Link>
            <Link href="/support" style={{ textDecoration: 'none', color: colors.neutral.gray400 }}>
              <Typography variant="caption">Support</Typography>
            </Link>
          </Box>
        </Box>

        {/* Social Proof */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.neutral.gray500 }}>
            Trusted by 1,000+ investors • 10,000+ deals analyzed • Average ROI improvement of 15%
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
