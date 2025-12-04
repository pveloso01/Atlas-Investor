'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Add as AddIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  Send as SendIcon,
  CheckCircle,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { Property } from '@/types/property';
import { useSubmitContactRequestMutation } from '@/lib/store/api/contactApi';

interface PropertyActionsProps {
  property: Property;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialContactForm: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function PropertyActions({ property }: PropertyActionsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>(initialContactForm);
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [submitContactRequest, { isLoading: isSubmittingContact }] = useSubmitContactRequestMutation();

  const handleSave = () => {
    setIsSaved(true);
    setSaveDialogOpen(false);
    // TODO: Implement save functionality
  };

  const handleExportPDF = () => {
    // Open the PDF report in a new window
    const reportUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/properties/${property.id}/report/`;
    window.open(reportUrl, '_blank');
  };

  const handleContact = () => {
    // Pre-fill message with property details
    setContactForm({
      ...initialContactForm,
      message: `I am interested in the property at ${property.address}. Please provide more information.`,
    });
    setFormErrors({});
    setContactDialogOpen(true);
  };

  const validateContactForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};

    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async () => {
    if (!validateContactForm()) {
      return;
    }

    try {
      await submitContactRequest({
        property: property.id,
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim() || undefined,
        message: contactForm.message.trim(),
      }).unwrap();

      setContactDialogOpen(false);
      setContactForm(initialContactForm);
      setSnackbar({
        open: true,
        message: 'Your inquiry has been sent! We will contact you within 24 hours.',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to send inquiry. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleContactFormChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({ ...contactForm, [field]: e.target.value });
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  const handleAddToPortfolio = () => {
    // TODO: Implement add to portfolio
    setSaveDialogOpen(true);
  };

  const handleInvest = () => {
    setInvestDialogOpen(true);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 80,
        zIndex: 10,
      }}
    >
      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          startIcon={isSaved ? <CheckCircle /> : <SaveIcon />}
          onClick={handleSave}
          fullWidth
          sx={{
            backgroundColor: isSaved ? colors.success.main : colors.primary.main,
            color: colors.neutral.white,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              backgroundColor: isSaved ? colors.success.dark : colors.primary.dark,
            },
          }}
        >
          {isSaved ? 'Saved' : 'Save this Deal'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<PdfIcon />}
          onClick={handleExportPDF}
          fullWidth
          sx={{
            borderColor: colors.neutral.gray300,
            color: colors.neutral.gray700,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: colors.primary.main,
              backgroundColor: colors.primary.main + '10',
            },
          }}
        >
          Export PDF Report
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<EmailIcon />}
          onClick={handleContact}
          fullWidth
          sx={{
            borderColor: colors.neutral.gray300,
            color: colors.neutral.gray700,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: colors.primary.main,
              backgroundColor: colors.primary.main + '10',
            },
          }}
        >
          Contact Seller/Broker
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleAddToPortfolio}
          fullWidth
          sx={{
            borderColor: colors.neutral.gray300,
            color: colors.neutral.gray700,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: colors.primary.main,
              backgroundColor: colors.primary.main + '10',
            },
          }}
        >
          Add to Portfolio
        </Button>

        <Divider />

        <Button
          variant="contained"
          size="large"
          startIcon={<CartIcon />}
          onClick={handleInvest}
          fullWidth
          sx={{
            backgroundColor: colors.accent.main,
            color: colors.neutral.white,
            textTransform: 'none',
            fontWeight: 700,
            py: 2,
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.39)',
            '&:hover': {
              backgroundColor: colors.accent.dark,
              boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Invest / Buy Now
        </Button>
      </Stack>

      {/* Contact Form Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Contact About This Property
            </Typography>
            <IconButton onClick={() => setContactDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, backgroundColor: colors.neutral.gray50, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 0.5 }}>
              Property
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {property.address}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 600, mt: 0.5 }}>
              {formatPrice(property.price)}
            </Typography>
          </Box>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Your Name"
              value={contactForm.name}
              onChange={handleContactFormChange('name')}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={contactForm.email}
              onChange={handleContactFormChange('email')}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />
            <TextField
              fullWidth
              label="Phone Number (optional)"
              value={contactForm.phone}
              onChange={handleContactFormChange('phone')}
              placeholder="+351 XXX XXX XXX"
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={contactForm.message}
              onChange={handleContactFormChange('message')}
              error={!!formErrors.message}
              helperText={formErrors.message}
              required
            />
          </Stack>

          <Alert severity="info" sx={{ mt: 2 }}>
            We will respond to your inquiry within 24 hours.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setContactDialogOpen(false)} disabled={isSubmittingContact}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleContactSubmit}
            disabled={isSubmittingContact}
            startIcon={isSubmittingContact ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
            }}
          >
            {isSubmittingContact ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Save Deal
            </Typography>
            <IconButton onClick={() => setSaveDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This deal has been saved to your favorites. You can access it anytime from your
            portfolio.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSave}>
            View Portfolio
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invest Confirmation Dialog */}
      <Dialog open={investDialogOpen} onClose={() => setInvestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirm Investment
            </Typography>
            <IconButton onClick={() => setInvestDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
            Review your investment details:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 1 }}>
              Property
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {property.address}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 1 }}>
              Price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.main }}>
              {formatPrice(property.price)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
            By proceeding, you agree to our terms and conditions. A representative will contact you
            within 24 hours to complete the transaction.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvestDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setInvestDialogOpen(false);
              // TODO: Implement investment flow
            }}
            sx={{
              backgroundColor: colors.accent.main,
              '&:hover': {
                backgroundColor: colors.accent.dark,
              },
            }}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
