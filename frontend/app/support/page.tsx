'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Email, Phone, LocationOn, Send, Schedule } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSubmitSupportMessageMutation } from '@/lib/store/api/feedbackApi';
import { useGetCurrentUserQuery } from '@/lib/store/api/authApi';
import { colors } from '@/lib/theme/colors';

interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  customSubject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  customSubject?: string;
  message?: string;
}

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Subscription' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'partnership', label: 'Partnership & Business' },
  { value: 'property', label: 'Property Inquiry' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
  { value: 'other', label: 'Other' },
];

const getSubjectLabel = (value: string): string => {
  const option = SUBJECT_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

export default function SupportPage() {
  const router = useRouter();
  // Only fetch user if token exists to avoid 401 errors
  const hasAuthToken = typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  const { data: user } = useGetCurrentUserQuery(undefined, {
    // Skip the query if no auth token exists to avoid unnecessary 401 errors
    skip: !hasAuthToken,
  });

  const [formData, setFormData] = useState<SupportFormData>({
    name: '',
    email: '',
    subject: '',
    customSubject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  const [submitSupportMessage, { isLoading }] = useSubmitSupportMessageMutation();

  // Pre-fill form with user data when available
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Check if user is authenticated
  const isAuthenticated =
    typeof window !== 'undefined' && !!localStorage.getItem('authToken') && !!user;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    } else if (formData.subject === 'other' && !formData.customSubject.trim()) {
      newErrors.customSubject = 'Please specify your subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof SupportFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
      customSubject: value !== 'other' ? '' : prev.customSubject,
    }));
    // Clear errors
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: undefined }));
    }
    if (errors.customSubject) {
      setErrors((prev) => ({ ...prev, customSubject: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check authentication before submitting
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please sign in to send a message. Redirecting to login...',
        severity: 'warning',
      });

      // Store form data in sessionStorage to restore after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('supportFormData', JSON.stringify(formData));
        sessionStorage.setItem('redirectAfterLogin', '/support');
      }

      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    try {
      const subjectText =
        formData.subject === 'other'
          ? formData.customSubject.trim()
          : getSubjectLabel(formData.subject);

      await submitSupportMessage({
        email: formData.email.trim(),
        subject: subjectText || 'General Inquiry',
        message: `From: ${formData.name.trim()}\n\n${formData.message.trim()}`,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      }).unwrap();

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        customSubject: '',
        message: '',
      });

      // Clear stored form data if any
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('supportFormData');
      }

      setSnackbar({
        open: true,
        message: 'Thank you for reaching out to support! We will get back to you within 24 hours.',
        severity: 'success',
      });
    } catch (error: unknown) {
      console.error('Failed to send message:', error);

      // Handle 401 authentication error
      if (
        (error as { status?: number | string })?.status === 401 ||
        (error as { status?: number | string })?.status === 'PARSING_ERROR'
      ) {
        setSnackbar({
          open: true,
          message: 'Your session has expired. Please sign in again to send a message.',
          severity: 'warning',
        });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('supportFormData', JSON.stringify(formData));
          sessionStorage.setItem('redirectAfterLogin', '/support');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to send message. Please try again or email us directly.',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Restore form data after login
  React.useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const storedFormData = sessionStorage.getItem('supportFormData');
      if (storedFormData) {
        try {
          const parsed = JSON.parse(storedFormData);
          setFormData((prev) => ({ ...prev, ...parsed }));
          sessionStorage.removeItem('supportFormData');
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [isAuthenticated]);

  return (
    <Box sx={{ bgcolor: colors.neutral.gray50, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.accent.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Support
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: colors.neutral.gray600, maxWidth: 700, mx: 'auto' }}
          >
            Have a question or need help? Our support team is here to assist you. Send us a message
            and we&apos;ll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Support Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${colors.neutral.gray200}`,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 3, color: colors.neutral.gray900 }}
              >
                Send us a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.neutral.white,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.neutral.white,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormControl
                      fullWidth
                      error={!!errors.subject}
                      sx={{
                        backgroundColor: colors.neutral.white,
                      }}
                    >
                      <InputLabel>Subject *</InputLabel>
                      <Select
                        value={formData.subject}
                        onChange={(e) => handleSubjectChange(e.target.value)}
                        label="Subject *"
                        sx={{
                          backgroundColor: colors.neutral.white,
                        }}
                      >
                        {SUBJECT_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                      {!errors.subject && <FormHelperText>What is this regarding?</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {formData.subject === 'other' && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Please specify your subject *"
                        value={formData.customSubject}
                        onChange={handleChange('customSubject')}
                        error={!!errors.customSubject}
                        helperText={errors.customSubject || 'Enter your custom subject'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: colors.neutral.white,
                          },
                        }}
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange('message')}
                      error={!!errors.message}
                      helperText={errors.message || 'Please provide details about your inquiry'}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: colors.neutral.white,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      startIcon={<Send />}
                      fullWidth
                      sx={{
                        backgroundColor: colors.accent.main,
                        color: colors.neutral.white,
                        fontWeight: 700,
                        py: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: colors.accent.dark,
                        },
                        '&:disabled': {
                          backgroundColor: colors.neutral.gray400,
                        },
                      }}
                    >
                      {isLoading
                        ? 'Sending...'
                        : isAuthenticated
                          ? 'Send Message'
                          : 'Sign In to Send'}
                    </Button>
                    {!isAuthenticated && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.neutral.gray600,
                          mt: 1,
                          display: 'block',
                          textAlign: 'center',
                        }}
                      >
                        You&apos;ll need to sign in to send your message
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Support Information */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Support Methods */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: `1px solid ${colors.neutral.gray200}`,
                  backgroundColor: colors.primary.main,
                  color: colors.neutral.white,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: colors.neutral.white }}
                >
                  Support Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Email sx={{ fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, opacity: 0.9 }}>
                        Email
                      </Typography>
                      <Typography
                        component="a"
                        href="mailto:support@atlasinvestor.com"
                        sx={{
                          color: colors.neutral.white,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        support@atlasinvestor.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Phone sx={{ fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, opacity: 0.9 }}>
                        Phone
                      </Typography>
                      <Typography
                        component="a"
                        href="tel:+351213456789"
                        sx={{
                          color: colors.neutral.white,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        +351 21 345 6789
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOn sx={{ fontSize: 28, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, opacity: 0.9 }}>
                        Address
                      </Typography>
                      <Typography variant="body1">
                        Lisbon, Portugal
                        <br />
                        1000-000
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Business Hours */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: `1px solid ${colors.neutral.gray200}`,
                  backgroundColor: colors.neutral.white,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Schedule sx={{ color: colors.primary.main, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.neutral.gray900 }}>
                    Business Hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                      Monday - Friday
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: colors.neutral.gray900 }}
                    >
                      9:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                      Saturday
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: colors.neutral.gray900 }}
                    >
                      10:00 AM - 2:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: colors.neutral.gray700 }}>
                      Sunday
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: colors.neutral.gray900 }}
                    >
                      Closed
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Response Time Notice */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: alpha(colors.success.main, 0.1),
              border: `1px solid ${alpha(colors.success.main, 0.3)}`,
              borderRadius: 2,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography variant="body1" sx={{ color: colors.neutral.gray700 }}>
              <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours
              during business days. For urgent matters, please call us directly.
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'warning' ? 3000 : 6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
