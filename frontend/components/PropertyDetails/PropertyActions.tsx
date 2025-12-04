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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Euro } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { Property } from '@/types/property';
import { useSubmitContactRequestMutation } from '@/lib/store/api/contactApi';
import {
  useGetPortfoliosQuery,
  useAddPropertyToPortfolioMutation,
  useCreatePortfolioMutation,
} from '@/lib/store/api/portfolioApi';

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
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>(initialContactForm);
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | ''>('');
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [propertyNotes, setPropertyNotes] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isCreatingNewPortfolio, setIsCreatingNewPortfolio] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [submitContactRequest, { isLoading: isSubmittingContact }] = useSubmitContactRequestMutation();
  const { data: portfolios } = useGetPortfoliosQuery();
  const [addPropertyToPortfolio, { isLoading: isAddingToPortfolio }] = useAddPropertyToPortfolioMutation();
  const [createPortfolio, { isLoading: isCreatingPortfolio }] = useCreatePortfolioMutation();

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
    // Pre-select default portfolio if available
    const defaultPortfolio = portfolios?.find(p => p.is_default);
    if (defaultPortfolio) {
      setSelectedPortfolioId(defaultPortfolio.id);
    } else if (portfolios && portfolios.length > 0) {
      setSelectedPortfolioId(portfolios[0].id);
    } else {
      setSelectedPortfolioId('');
      setIsCreatingNewPortfolio(true);
    }
    setPropertyNotes('');
    setTargetPrice('');
    setPortfolioDialogOpen(true);
  };

  const handleAddToPortfolioSubmit = async () => {
    try {
      let portfolioId = selectedPortfolioId;

      // Create new portfolio if needed
      if (isCreatingNewPortfolio && newPortfolioName.trim()) {
        const newPortfolio = await createPortfolio({
          name: newPortfolioName.trim(),
        }).unwrap();
        portfolioId = newPortfolio.id;
      }

      if (!portfolioId) {
        setSnackbar({
          open: true,
          message: 'Please select or create a portfolio',
          severity: 'error',
        });
        return;
      }

      await addPropertyToPortfolio({
        portfolioId: portfolioId as number,
        property_id: property.id,
        notes: propertyNotes.trim() || undefined,
        target_price: targetPrice ? parseFloat(targetPrice) : undefined,
      }).unwrap();

      setPortfolioDialogOpen(false);
      setNewPortfolioName('');
      setIsCreatingNewPortfolio(false);
      setSnackbar({
        open: true,
        message: 'Property added to portfolio!',
        severity: 'success',
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { error?: string })?.error || 'Failed to add property'
        : 'Failed to add property to portfolio';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
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

      {/* Add to Portfolio Dialog */}
      <Dialog open={portfolioDialogOpen} onClose={() => setPortfolioDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add to Portfolio
            </Typography>
            <IconButton onClick={() => setPortfolioDialogOpen(false)} size="small">
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

          {portfolios && portfolios.length > 0 && !isCreatingNewPortfolio ? (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Portfolio</InputLabel>
              <Select
                value={selectedPortfolioId}
                label="Select Portfolio"
                onChange={(e) => setSelectedPortfolioId(e.target.value as number)}
              >
                {portfolios.map((portfolio) => (
                  <MenuItem key={portfolio.id} value={portfolio.id}>
                    {portfolio.name} ({portfolio.property_count} properties)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              label="New Portfolio Name"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g., Lisbon Investments"
            />
          )}

          {portfolios && portfolios.length > 0 && (
            <Button
              size="small"
              onClick={() => {
                setIsCreatingNewPortfolio(!isCreatingNewPortfolio);
                if (!isCreatingNewPortfolio) {
                  setSelectedPortfolioId('');
                }
              }}
              sx={{ mb: 2 }}
            >
              {isCreatingNewPortfolio ? 'Select existing portfolio' : '+ Create new portfolio'}
            </Button>
          )}

          <TextField
            fullWidth
            label="Notes (optional)"
            multiline
            rows={2}
            value={propertyNotes}
            onChange={(e) => setPropertyNotes(e.target.value)}
            placeholder="Add notes about this property..."
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Target Price (optional)"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Enter your target purchase price"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Euro sx={{ color: colors.neutral.gray400 }} />
                </InputAdornment>
              ),
            }}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Track this property in your portfolio to monitor price changes.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPortfolioDialogOpen(false)} disabled={isAddingToPortfolio || isCreatingPortfolio}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddToPortfolioSubmit}
            disabled={isAddingToPortfolio || isCreatingPortfolio || (!selectedPortfolioId && !newPortfolioName.trim())}
            startIcon={(isAddingToPortfolio || isCreatingPortfolio) ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
            }}
          >
            {isAddingToPortfolio || isCreatingPortfolio ? 'Adding...' : 'Add to Portfolio'}
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
