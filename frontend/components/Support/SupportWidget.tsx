'use client';

import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import { Help as HelpIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { useSubmitSupportMessageMutation } from '@/lib/store/api/feedbackApi';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [submitSupportMessage, { isLoading }] = useSubmitSupportMessageMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessage('');
  };

  const handleSend = async () => {
    if (!message.trim() || !email.trim()) return;

    try {
      await submitSupportMessage({
        email,
        message,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      }).unwrap();

      setSnackbar({
        open: true,
        message: 'Message sent! We\'ll get back to you soon.',
        severity: 'success',
      });
      setMessage('');
      setEmail('');
      handleClose();
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="help"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        }}
      >
        <HelpIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Need Help?
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 2 }}>
              Our support team is here to help. Send us a message and we&apos;ll get back to you within 24 hours.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: colors.neutral.gray50, borderRadius: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: colors.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutral.white,
                  fontWeight: 600,
                }}
              >
                JD
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  João Dias
                </Typography>
                <Typography variant="caption" sx={{ color: colors.neutral.gray600 }}>
                  Support Specialist
                </Typography>
              </Box>
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!message.trim() || !email.trim() || isLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}


