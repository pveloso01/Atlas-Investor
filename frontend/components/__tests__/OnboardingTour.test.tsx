import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import OnboardingTour from '../Onboarding/OnboardingTour';
import userEvent from '@testing-library/user-event';

const mockSteps = [
  { id: '1', title: 'Step 1', description: 'Description 1' },
  { id: '2', title: 'Step 2', description: 'Description 2' },
  { id: '3', title: 'Step 3', description: 'Description 3' },
];

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('OnboardingTour', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('opens tour when not completed', async () => {
    render(<OnboardingTour steps={mockSteps} />);
    // Run the setTimeout that opens the tour
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  it('does not open tour when already completed', async () => {
    localStorageMock.setItem('atlas-onboarding-completed', 'true');
    render(<OnboardingTour steps={mockSteps} />);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
    });
  });

  it('navigates to next step', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<OnboardingTour steps={mockSteps} />);

    const nextButton = await screen.findByText(/next/i);
    await user.click(nextButton);
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('navigates to previous step', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<OnboardingTour steps={mockSteps} />);

    const nextButton = await screen.findByText(/next/i);
    await user.click(nextButton);
    const prevButton = screen.getByText(/previous/i);
    await user.click(prevButton);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('calls onComplete when tour is finished', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    const onComplete = jest.fn();
    render(<OnboardingTour steps={mockSteps} onComplete={onComplete} />);

    // Wait for tour to open
    await screen.findByText('Step 1');

    // Navigate through all steps
    for (let i = 0; i < mockSteps.length - 1; i++) {
      const nextButton = screen.getByText(/next/i);
      await user.click(nextButton);
    }
    const finishButton = screen.getByText(/get started/i);
    await user.click(finishButton);
    expect(onComplete).toHaveBeenCalled();
  });

  it('calls onSkip when skip is clicked', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    const onSkip = jest.fn();
    render(<OnboardingTour steps={mockSteps} onSkip={onSkip} />);

    const skipButton = await screen.findByText(/skip/i);
    await user.click(skipButton);
    expect(onSkip).toHaveBeenCalled();
  });

  it('does not open when already completed in localStorage', async () => {
    localStorageMock.setItem('atlas-onboarding-completed', 'true');
    render(<OnboardingTour steps={mockSteps} />);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
    });
  });

  it('handles custom storage key', async () => {
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} storageKey="custom-key" />);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  it('saves completion to custom storage key', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} storageKey="custom-key" />);

    // Wait for tour to open and navigate to finish
    await screen.findByText('Step 1');

    // Navigate through all steps
    for (let i = 0; i < mockSteps.length - 1; i++) {
      const nextButton = screen.getByText(/next/i);
      await user.click(nextButton);
    }

    const finishButton = screen.getByText(/get started/i);
    await user.click(finishButton);
    expect(localStorageMock.getItem('custom-key')).toBe('true');
  });

  it('does not call onComplete when not provided', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);

    // Wait for tour to open
    await screen.findByText('Step 1');

    // Navigate through all steps
    for (let i = 0; i < mockSteps.length - 1; i++) {
      const nextButton = screen.getByText(/next/i);
      await user.click(nextButton);
    }
    const finishButton = screen.getByText(/get started/i);
    await user.click(finishButton);
    // Should complete without error even without onComplete callback
    expect(localStorageMock.getItem('atlas-onboarding-completed')).toBe('true');
  });

  it('does not call onSkip when not provided', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);

    const skipButton = await screen.findByText(/skip/i);
    await user.click(skipButton);
    // Should skip without error even without onSkip callback
    expect(localStorageMock.getItem('atlas-onboarding-completed')).toBe('true');
  });

  it('handles previous button on first step', async () => {
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);
    jest.runAllTimers();
    await waitFor(() => {
      // On first step, previous button should not exist
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });

  it('handles next button on last step', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    const onComplete = jest.fn();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} onComplete={onComplete} />);

    // Wait for tour to open
    await screen.findByText('Step 1');

    // Navigate to last step
    for (let i = 0; i < mockSteps.length - 1; i++) {
      const nextButton = screen.getByText(/next/i);
      await user.click(nextButton);
    }
    // On last step, next button should complete the tour
    const finishButton = screen.getByText(/Get Started|finish|complete/i);
    await user.click(finishButton);
    expect(onComplete).toHaveBeenCalled();
  });

  it('shows previous button when not on first step', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);

    const nextButton = await screen.findByText(/next/i);
    await user.click(nextButton);
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('does not show previous button on first step', async () => {
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });

  it('displays correct button text on last step', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);

    // Wait for tour to open
    await screen.findByText('Step 1');

    // Navigate to last step
    for (let i = 0; i < mockSteps.length - 1; i++) {
      const nextButton = screen.getByText(/next/i);
      await user.click(nextButton);
    }
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('displays Next button when not on last step', async () => {
    localStorageMock.clear();
    render(<OnboardingTour steps={mockSteps} />);
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });
});
