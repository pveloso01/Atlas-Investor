'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function SecurityPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Security & Privacy
      </Typography>
      <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 6, textAlign: 'center' }}>
        Your data and privacy are our top priorities
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LockIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                SSL Encryption
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
              All data transmitted between your browser and our servers is encrypted using SSL/TLS
              protocols. This ensures that your information remains secure and private.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <VerifiedUserIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                GDPR Compliant
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
              We fully comply with the General Data Protection Regulation (GDPR). Your personal data
              is processed lawfully, transparently, and only for specified purposes.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <ShieldIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Secure Payment Processing
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}>
              All payment transactions are processed through PCI-DSS compliant payment gateways. We
              never store your full credit card information.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ fontSize: 16, color: colors.success.main }} />
              <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                Secure Checkout
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SecurityIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Regular Security Audits
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
              We conduct regular security audits and penetration testing to identify and address any
              potential vulnerabilities. Our infrastructure is monitored 24/7.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Trust Badges & Certifications
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="SSL Certificate"
                  secondary="Validated by trusted certificate authority"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="GDPR Compliance"
                  secondary="Fully compliant with European data protection regulations"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="PCI-DSS Compliant"
                  secondary="Secure payment processing standards"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

