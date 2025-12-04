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
} from '@mui/material';
import {
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Add as AddIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { Property } from '@/types/property';

interface PropertyActionsProps {
  property: Property;
}

export default function PropertyActions({ property }: PropertyActionsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setSaveDialogOpen(false);
    // TODO: Implement save functionality
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    window.print();
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    window.location.href = `mailto:info@atlasinvestor.com?subject=Inquiry about Property ${property.id}`;
  };

  const handleAddToPortfolio = () => {
    // TODO: Implement add to portfolio
    setSaveDialogOpen(true);
  };

  const handleInvest = () => {
    setInvestDialogOpen(true);
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
          startIcon={isSaved ? <SaveIcon /> : <SaveIcon />}
          onClick={handleSave}
          fullWidth
          sx={{
            backgroundColor: colors.primary.main,
            color: colors.neutral.white,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              backgroundColor: colors.primary.dark,
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
              {new Intl.NumberFormat('pt-PT', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              }).format(parseFloat(property.price))}
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
    </Box>
  );
}



