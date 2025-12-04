'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle as CheckCircleIcon, DataObject as DataObjectIcon, Update as UpdateIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function MethodologyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Data & Methodology
      </Typography>
      <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 6 }}>
        Transparency in how we collect, process, and present real estate data
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <DataObjectIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Data Sources
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Portuguese Government APIs"
                  secondary="Official property records, zoning data, and demographic information"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Idealista"
                  secondary="Property listings and market prices"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="INE Portugal"
                  secondary="Census and demographic data"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Municipal Records"
                  secondary="Local zoning and development regulations"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <UpdateIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Update Frequency
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Property Listings"
                  secondary="Updated daily from multiple sources"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Market Prices"
                  secondary="Refreshed weekly with latest transactions"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Zoning Data"
                  secondary="Updated monthly from municipal records"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Demographic Data"
                  secondary="Updated quarterly from INE Portugal"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Analysis Methodology
            </Typography>
            <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
              Our investment analysis uses proprietary algorithms that combine multiple data points to
              calculate ROI, yield, and other key metrics. We use:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Historical Market Data"
                  secondary="Analysis of past transactions and price trends"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Comparative Market Analysis"
                  secondary="Comparison with similar properties in the area"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: colors.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Predictive Modeling"
                  secondary="AI-powered forecasts with 85%+ accuracy based on historical data"
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 3, p: 3, backgroundColor: colors.info.main + '10', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: colors.neutral.gray700, lineHeight: 1.7 }}>
                <strong>Note:</strong> All calculations are estimates based on available data and
                market assumptions. Actual returns may vary. Always consult with a qualified real
                estate professional before making investment decisions.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

