/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Divider, Link } from '@mui/material';
import { colors } from '@/lib/theme/colors';

export default function TermsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Terms of Service
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: colors.neutral.gray600, mb: 6, textAlign: 'center' }}
      >
        Last updated:{' '}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </Typography>

      <Paper sx={{ p: 6, border: `1px solid ${colors.neutral.gray200}`, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            By accessing and using the Atlas Investor platform ("Service"), you accept and agree to
            be bound by the terms and provision of this agreement. If you do not agree to abide by
            the above, please do not use this service.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            2. Service Description
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            Atlas Investor is a real estate investment analysis platform that provides:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Property listings and market data from third-party sources
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Investment analysis tools and calculators (ROI, yield, cash flow projections)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Market insights and comparative analysis
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Zoning and regulatory information
              </Typography>
            </li>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, fontWeight: 600 }}
          >
            IMPORTANT: The Service provides insights, analysis tools, and data for informational
            purposes only. Atlas Investor does not provide financial, investment, legal, or tax
            advice. All information should be verified independently before making any investment
            decisions.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            3. No Guarantees or Warranties
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Warranties of merchantability, fitness for a particular purpose, or non-infringement
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Guarantees regarding the accuracy, completeness, reliability, or timeliness of any
                data, information, or analysis provided
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Guarantees that the Service will be uninterrupted, secure, or error-free
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Guarantees regarding investment outcomes, returns, or financial results
              </Typography>
            </li>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, fontWeight: 600 }}
          >
            Atlas Investor offers no 100% guarantees regarding the accuracy of data, the success of
            investments, or any financial outcomes. All projections, estimates, and analyses are
            based on available data and assumptions that may not reflect actual market conditions or
            future performance.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            4. Limitation of Liability
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2, fontWeight: 600 }}
          >
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ATLAS INVESTOR AND ITS AFFILIATES, OFFICERS,
            DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Any investment losses, financial losses, or damages resulting from investment
                decisions made based on information, data, or analysis provided through the Service
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Any indirect, incidental, special, consequential, or punitive damages
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Loss of profits, revenue, data, use, goodwill, or other intangible losses
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Errors, inaccuracies, or omissions in any data, information, or analysis provided
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Actions or omissions of third-party data providers or service providers
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Interruptions, delays, or cessation of the Service
              </Typography>
            </li>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, fontWeight: 600, mb: 2 }}
          >
            Atlas Investor is not legally bound to any losses that may occur while using this
            platform. By using the Service, you acknowledge and agree that you bear all risk
            associated with any investment decisions made based on information provided through the
            platform.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            In no event shall Atlas Investor's total liability to you for all damages exceed the
            amount you paid to Atlas Investor in the twelve (12) months preceding the claim.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            5. User Responsibilities
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            As a user of the Service, you agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Conduct your own independent research, verification, and due diligence before making
                any investment decisions
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Consult with qualified financial, legal, and tax advisors before making investment
                decisions
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Verify all data, information, and analysis independently before relying on it
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Understand that all projections, estimates, and analyses are estimates based on
                available data and may not reflect actual outcomes
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Use the Service in compliance with all applicable laws and regulations
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Not hold Atlas Investor responsible for any investment decisions or their outcomes
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            6. Data and Accuracy Disclaimers
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            All data, information, and analysis provided through the Service are:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Sourced from third-party providers (including but not limited to Idealista,
                Portuguese government APIs, and other public sources)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Based on regional averages, historical data, and assumptions that may not reflect
                current or future market conditions
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Subject to errors, omissions, and inaccuracies that may occur in data collection,
                processing, or presentation
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Estimates and projections that may vary significantly from actual results
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            Atlas Investor does not guarantee the accuracy, completeness, or reliability of any data
            or information provided. You should independently verify all information before making
            any investment decisions.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            7. Intellectual Property
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            The Service, including all content, features, functionality, and software, is owned by
            Atlas Investor and is protected by international copyright, trademark, patent, trade
            secret, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            You may not reproduce, distribute, modify, create derivative works of, publicly display,
            publicly perform, republish, download, store, or transmit any of the material on our
            Service without prior written consent from Atlas Investor.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            8. Termination
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We may terminate or suspend your access to the Service immediately, without prior notice
            or liability, for any reason, including if you breach the Terms of Service.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            Upon termination, your right to use the Service will immediately cease. All provisions
            of these Terms that by their nature should survive termination shall survive
            termination, including ownership provisions, warranty disclaimers, and limitations of
            liability.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            9. Changes to Terms
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We reserve the right, at our sole discretion, to modify or replace these Terms at any
            time. If a revision is material, we will provide at least 30 days notice prior to any
            new terms taking effect.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            What constitutes a material change will be determined at our sole discretion. Your
            continued use of the Service after any changes constitutes acceptance of the new Terms.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            10. Governing Law
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            These Terms shall be governed by and construed in accordance with the laws of Portugal,
            without regard to its conflict of law provisions.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            Any disputes arising out of or relating to these Terms or the Service shall be subject
            to the exclusive jurisdiction of the courts of Portugal.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            11. Contact Information
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            If you have any questions about these Terms of Service, please contact us:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            <Link href="/support" sx={{ color: colors.primary.main }}>
              Support
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            p: 3,
            backgroundColor: colors.warning.light,
            borderRadius: 2,
            border: `1px solid ${colors.warning.main}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.warning.dark }}>
            Important Reminder
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray800, lineHeight: 1.8 }}>
            Atlas Investor provides insights and analysis tools to help you make informed decisions,
            but offers no 100% guarantees. We are not legally bound to any losses that may occur
            while using this platform. All investment decisions are made at your own risk, and you
            must conduct your own due diligence and consult with qualified professionals before
            making any investment decisions.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
