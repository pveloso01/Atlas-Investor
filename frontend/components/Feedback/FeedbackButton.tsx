'use client';

import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Rating } from '@mui/material';
import { Feedback as FeedbackIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRating(null);
    setFeedback('');
  };

  const handleSend = () => {
    // TODO: Implement feedback submission
    console.log('Submitting feedback:', { rating, feedback });
    handleClose();
  };

  return (
    <>
      <Fab
        color="secondary"
        aria-label="feedback"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          zIndex: 1000,
          backgroundColor: colors.accent.main,
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
            disabled={!rating}
            sx={{
              textTransform: 'none',
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}





