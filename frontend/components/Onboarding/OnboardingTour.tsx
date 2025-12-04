'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { colors } from '@/lib/theme/colors';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
}

export default function OnboardingTour({
  steps,
  onComplete,
  onSkip,
  storageKey = 'atlas-onboarding-completed',
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already completed onboarding
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      // Use setTimeout to avoid calling setState synchronously within effect
      setTimeout(() => {
        setIsOpen(true);
      }, 0);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsOpen(false);
    onSkip?.();
  };

  if (!isOpen) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <Button
          onClick={handleSkip}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 'auto',
            p: 1,
          }}
        >
          <CloseIcon />
        </Button>

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          {currentStepData.title}
        </Typography>
        <Typography variant="body1" sx={{ color: colors.neutral.gray700, mb: 4, lineHeight: 1.7 }}>
          {currentStepData.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleSkip} sx={{ textTransform: 'none' }}>
            Skip Tour
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentStep > 0 && (
              <Button onClick={handlePrevious} variant="outlined" sx={{ textTransform: 'none' }}>
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                backgroundColor: colors.primary.main,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: colors.primary.dark,
                },
              }}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}


