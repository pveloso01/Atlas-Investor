'use client';

import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Rating, Snackbar, Alert } from '@mui/material';
import { Feedback as FeedbackIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';
import { useSubmitFeedbackMutation } from '@/lib/store/api/feedbackApi';
import { useFooterPosition } from '@/hooks/useFooterPosition';

export default function FeedbackButton() {
  const bottomOffset = useFooterPosition();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRating(null);
    setFeedback('');
  };

  const handleSend = async () => {
    if (!rating) return;

    try {
      await submitFeedback({
        rating,
        comment: feedback,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      }).unwrap();

      setSnackbar({
        open: true,
        message: 'Thank you for your feedback!',
        severity: 'success',
      });
      handleClose();
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to submit feedback. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Fab
        color="secondary"
        aria-label="feedback"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: bottomOffset + 76, // Stack above SupportWidget (56px FAB + 20px gap)
          right: 24,
          zIndex: 1000,
          backgroundColor: colors.accent.main,
          transition: 'bottom 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: colors.accent.dark,
          },
        }}
      >
        <FeedbackIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Share Your Feedback
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.gray600, mb: 2 }}>
              Your feedback helps us improve. How would you rate your experience?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />
              {rating && (
                <Typography variant="body2" sx={{ color: colors.neutral.gray600 }}>
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                </Typography>
              )}
            </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Comments"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more about your experience..."
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
            disabled={!rating || isLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
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





