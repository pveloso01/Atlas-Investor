/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Divider, Link } from '@mui/material';
import { colors } from '@/lib/theme/colors';

export default function PrivacyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Privacy Policy
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
            1. Introduction
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            Atlas Investor ("we," "our," or "us") is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our real estate investment analysis platform (the "Service").
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            By using our Service, you agree to the collection and use of information in accordance
            with this policy. If you do not agree with our policies and practices, please do not use
            our Service.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            2. Information We Collect
          </Typography>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            2.1 Personal Information
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We may collect personal information that you provide directly to us, including:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Name and contact information (email address, phone number)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Account credentials (username, password)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Payment information (processed through secure third-party payment processors)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Profile information and preferences
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Communications with us (support requests, feedback, inquiries)
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            2.2 Usage Data
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We automatically collect certain information when you use our Service, including:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Device information (IP address, browser type, operating system)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Usage patterns (pages visited, features used, time spent)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Search queries and saved properties
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Error logs and performance data
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            2.3 Cookies and Tracking Technologies
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We use cookies and similar tracking technologies to track activity on our Service and
            hold certain information. Cookies are files with a small amount of data which may
            include an anonymous unique identifier. You can instruct your browser to refuse all
            cookies or to indicate when a cookie is being sent.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            3. How We Use Your Information
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We use the information we collect for various purposes, including:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To provide, maintain, and improve our Service
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To process your transactions and manage your account
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To send you service-related communications (notifications, updates, security alerts)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To personalize your experience and provide relevant content
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To analyze usage patterns and improve our Service
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To detect, prevent, and address technical issues and security threats
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                To comply with legal obligations and enforce our Terms of Service
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            4. Data Security
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We implement appropriate technical and organizational security measures to protect your
            personal information, including:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                SSL/TLS encryption for data transmission
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Secure password hashing and authentication
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Regular security audits and vulnerability assessments
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Access controls and authentication mechanisms
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Secure data storage and backup procedures
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            However, no method of transmission over the Internet or electronic storage is 100%
            secure. While we strive to use commercially acceptable means to protect your personal
            information, we cannot guarantee absolute security.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            5. GDPR Compliance
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            If you are located in the European Economic Area (EEA) or United Kingdom, you have
            certain data protection rights under the General Data Protection Regulation (GDPR).
            These rights include:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Access:</strong> You can request copies of your personal data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Rectification:</strong> You can request correction of inaccurate or
                incomplete data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Erasure:</strong> You can request deletion of your personal data
                under certain circumstances
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Restrict Processing:</strong> You can request restriction of
                processing of your personal data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Data Portability:</strong> You can request transfer of your data to
                another service provider
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Object:</strong> You can object to processing of your personal data
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time
                where we rely on consent to process your data
              </Typography>
            </li>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            To exercise any of these rights, please contact us using the contact information
            provided at the end of this Privacy Policy.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            We process your personal data lawfully, transparently, and only for specified purposes
            as outlined in this Privacy Policy. We will retain your personal data only for as long
            as necessary to fulfill the purposes outlined in this policy, unless a longer retention
            period is required or permitted by law.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            6. Data Sharing and Disclosure
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information in the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Service Providers:</strong> We may share information with third-party
                service providers who perform services on our behalf (hosting, payment processing,
                analytics)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Legal Requirements:</strong> We may disclose information if required by law
                or in response to valid requests by public authorities
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale
                of assets, your information may be transferred
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                <strong>With Your Consent:</strong> We may share information with your explicit
                consent
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            7. Third-Party Services
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            Our Service may contain links to third-party websites or integrate with third-party
            services. We are not responsible for the privacy practices of these third parties. We
            encourage you to review the privacy policies of any third-party services you access.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            Third-party services we may use include:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Payment processors (Stripe, PayPal, etc.)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Analytics services (Google Analytics, etc.)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
                Data providers (Idealista, Portuguese government APIs, etc.)
              </Typography>
            </li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            8. Children's Privacy
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            Our Service is not intended for individuals under the age of 18. We do not knowingly
            collect personal information from children. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact us immediately.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            9. Changes to This Privacy Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            You are advised to review this Privacy Policy periodically for any changes. Changes to
            this Privacy Policy are effective when they are posted on this page.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            10. Contact Us
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: colors.neutral.gray700, lineHeight: 1.8, mb: 2 }}
          >
            If you have any questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.neutral.gray700, lineHeight: 1.8 }}>
            <Link href="/support" sx={{ color: colors.primary.main }}>
              Support
            </Link>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colors.neutral.gray600, mt: 2, fontStyle: 'italic' }}
          >
            For GDPR-related requests, please include "GDPR Request" in your subject line for faster
            processing.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
