'use client';

import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton } from '@mui/material';
import { Help as HelpIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = () => {
    // TODO: Implement support message sending
    console.log('Sending support message:', message);
    setMessage('');
    handleClose();
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
            disabled={!message.trim()}
            sx={{
              textTransform: 'none',
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


