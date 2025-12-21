/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import {
  Analytics,
  Security,
  TrendingUp,
  ArrowForward,
  Lightbulb,
  Speed,
  Savings,
  Accessibility,
  Visibility,
  EmojiEvents,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        About Atlas Investor
      </Typography>
      <Typography variant="h6" sx={{ color: colors.neutral.gray600, mb: 6, textAlign: 'center' }}>
        Empowering real estate investors in Portugal with data-driven insights
      </Typography>

      {/* Mission Section */}
      <Paper sx={{ p: 6, mb: 6, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          Atlas Investor was created to democratize real estate investment analysis in Portugal. We believe
          that everyone should have access to the same powerful tools and insights that professional
          investors use to make informed decisions.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
          Our platform combines official government data, market listings, and proprietary analysis
          algorithms to provide you with comprehensive property insights, ROI calculations, and investment
          recommendations all in one place. We're breaking down the barriers that have traditionally made
          real estate investment analysis complex and time-consuming.
        </Typography>
      </Paper>

      {/* Vision Section */}
      <Paper sx={{ p: 6, mb: 6, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Our Vision
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          We envision a Portugal where anyone can make informed real estate investment decisions, regardless
          of their experience level or access to professional resources. Our long-term goal is to become the
          go-to platform for Portuguese real estate analysis, trusted by both beginners and seasoned
          investors alike.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          We're building towards a future where data-driven decision making is the standard for all real
          estate investments, not just those made by professionals with extensive resources. By enabling
          transparent, accessible, and comprehensive analysis, we're creating a community of informed
          investors who can confidently navigate the Portuguese real estate market.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
          Ultimately, we want to see more successful real estate investments in Portugal, with fewer
          mistakes and better outcomes for everyone involved.
        </Typography>
      </Paper>

      {/* Motivation Section */}
      <Paper sx={{ p: 6, mb: 6, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Lightbulb sx={{ color: colors.primary.main, fontSize: 32 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Why We Built This
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          Real estate investment analysis in Portugal is fragmented and time-consuming. Investors face the
          challenge of gathering information from multiple disconnected sources: property listings on one
          platform, market statistics elsewhere, zoning data in municipal offices, and financial calculations
          done manually in spreadsheets.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          We saw investors struggling with scattered information, complex manual calculations, and a lack of
          transparency in how investment metrics were derived. Many potential investors were discouraged by
          the complexity, while others made costly mistakes due to incomplete analysis.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 3 }}>
          This frustration inspired us to create a unified platform that simplifies the entire process. We
          understood these challenges firsthand and recognized that technology could bridge the gap between
          complex data and actionable insights.
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
          Atlas Investor is our solution: a single platform that brings together all the tools, data, and
          analysis you need to make confident investment decisions, saving you time while helping you avoid
          costly mistakes.
        </Typography>
      </Paper>

      {/* Value Delivered Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
          Value We Deliver
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Speed sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Time Savings
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Reduce weeks of manual research to minutes of automated analysis. What used to take days of
                data gathering and calculation now happens instantly.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Analytics sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Better Decisions
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Make data-driven decisions with insights from multiple trusted sources. Our comprehensive
                analysis gives you a complete picture of each investment opportunity.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Savings sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cost Efficiency
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Avoid costly mistakes with comprehensive analysis before you invest. Identify potential issues
                and opportunities that might not be obvious at first glance.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Accessibility sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Accessibility
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Professional-grade tools available to everyone, not just large investment firms. Level the
                playing field with the same analytical capabilities used by experts.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Visibility sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Transparency
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Clear methodology and data sources so you understand exactly how we arrive at our insights.
                No black boxes—just transparent, verifiable analysis.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmojiEvents sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ROI Improvement
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Our users see an average 15% ROI improvement by using our platform to identify better deals
                and make more informed investment decisions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Core Principles Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
          Our Core Principles
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Analytics sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Data-Driven
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                We aggregate data from multiple trusted sources including Portuguese government APIs,
                Idealista, and other verified providers to give you the most accurate market insights.
                Every recommendation is backed by real data, not assumptions.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Security sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Transparent
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                We believe in transparency. All our calculations, data sources, and methodologies are clearly
                documented so you understand exactly how we arrive at our insights. No hidden algorithms or
                unexplained metrics.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUp sx={{ color: colors.primary.main, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Results-Focused
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                We measure our success by your success. Our platform is designed to deliver real,
                measurable improvements in investment outcomes. Proven results, not just promises.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Call-to-Action Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
          Learn More
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 4, lineHeight: 1.8 }}>
          Explore our methodology and see why thousands of investors trust Atlas Investor
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/about/methodology"
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              '&:hover': {
                borderColor: colors.primary.dark,
                backgroundColor: colors.primary.main + '10',
              },
            }}
          >
            Our Methodology
          </Button>
          <Button
            component={Link}
            href="/about/trust"
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{
              borderColor: colors.primary.main,
              color: colors.primary.main,
              '&:hover': {
                borderColor: colors.primary.dark,
                backgroundColor: colors.primary.main + '10',
              },
            }}
          >
            Why Trust Us
          </Button>
        </Box>
      </Box>

      {/* Legal Disclaimer */}
      <Paper
        sx={{
          p: 4,
          backgroundColor: colors.neutral.gray50,
          border: `1px solid ${colors.neutral.gray200}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
          Important Notice
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
          Atlas Investor provides insights and analysis tools for informational purposes only. We do not
          provide financial, investment, legal, or tax advice. All investment decisions are made at your own
          risk. Please review our{' '}
          <Link href="/terms" style={{ color: colors.primary.main, textDecoration: 'underline' }}>
            Terms of Service
          </Link>{' '}
          for complete details on our liability limitations and user responsibilities.
        </Typography>
      </Paper>
    </Container>
  );
}

