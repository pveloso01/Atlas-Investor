import React from 'react';
import { render, screen, waitFor, fireEvent } from '@/__tests__/utils/test-utils';
import FeedbackButton from '../Feedback/FeedbackButton';
import userEvent from '@testing-library/user-event';

// Mock the feedback API - need to mock the entire module including the api object
jest.mock('@/lib/store/api/feedbackApi', () => {
  const mockMutation = jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) });
  return {
    feedbackApi: {
      reducerPath: 'feedbackApi',
      reducer: (state = {}) => state,
      middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
    },
    useSubmitFeedbackMutation: () => [mockMutation, { isLoading: false }],
    useGetFeedbackQuery: () => ({ data: [], isLoading: false }),
    useSubmitSupportMessageMutation: () => [mockMutation, { isLoading: false }],
    useGetSupportMessagesQuery: () => ({ data: [], isLoading: false }),
    useSubmitContactRequestMutation: () => [mockMutation, { isLoading: false }],
    useGetContactRequestsQuery: () => ({ data: [], isLoading: false }),
  };
});

describe('FeedbackButton', () => {
  it('renders feedback button', () => {
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    expect(feedbackButton).toBeInTheDocument();
  });

  it('opens dialog when feedback button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when close icon is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // Find the IconButton with close icon
    const allButtons = screen.getAllByRole('button');
    const closeIconButton = allButtons.find((btn) => btn.classList.contains('MuiIconButton-root'));
    expect(closeIconButton).toBeDefined();
    if (closeIconButton) {
      await user.click(closeIconButton);
      await waitFor(() => {
        expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
      });
    }
  });

  it('allows rating selection via radio change', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    // Find the rating container and get the radio inputs
    const radios = screen.getAllByRole('radio', { hidden: true });
    expect(radios.length).toBeGreaterThan(0);

    // Use fireEvent to directly trigger the rating change
    const rating5 = radios.find((r) => (r as HTMLInputElement).value === '5');
    if (rating5) {
      fireEvent.click(rating5);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        expect(submitButton).not.toBeDisabled();
      });
    }
  });

  it('disables submit button when no rating is selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when rating is selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    // Use fireEvent to simulate rating selection
    const radios = screen.getAllByRole('radio', { hidden: true });
    const rating1 = radios.find((r) => (r as HTMLInputElement).value === '1');
    if (rating1) {
      fireEvent.click(rating1);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit feedback/i });
        expect(submitButton).not.toBeDisabled();
      });
    }
  });

  it('allows entering feedback text', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Great platform!');
    expect(textField).toHaveValue('Great platform!');
  });

  it('displays rating text for different ratings', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    const radios = screen.getAllByRole('radio', { hidden: true });

    // Test rating 5 - Excellent!
    const rating5 = radios.find((r) => (r as HTMLInputElement).value === '5');
    if (rating5) {
      fireEvent.click(rating5);
      await waitFor(() => {
        expect(screen.getByText('Excellent!')).toBeInTheDocument();
      });
    }
  });

  it('resets form when dialog is closed', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    // Type feedback
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Test feedback');

    // Close dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
    });

    // Reopen and verify form is reset
    await user.click(feedbackButton);
    const newTextField = screen.getByLabelText('Additional Comments');
    expect(newTextField).toHaveValue('');
    // Submit should be disabled again (no rating)
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    expect(submitButton).toBeDisabled();
  });

  it('submits feedback when send button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    // Set rating using fireEvent
    const radios = screen.getAllByRole('radio', { hidden: true });
    const rating5 = radios.find((r) => (r as HTMLInputElement).value === '5');
    if (rating5) {
      fireEvent.click(rating5);
    }

    // Type feedback
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Great platform!');

    // Wait for submit button to be enabled
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    await user.click(submitButton);

    // After submitting, the dialog should close (snackbar shows success)
    await waitFor(() => {
      expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
    });
  });

  it('closes dialog after submitting feedback', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    // Set rating using fireEvent
    const radios = screen.getAllByRole('radio', { hidden: true });
    const rating5 = radios.find((r) => (r as HTMLInputElement).value === '5');
    if (rating5) {
      fireEvent.click(rating5);
    }

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
    });
  });

  it('executes feedback onChange callback', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);

    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Test feedback');
    expect(textField).toHaveValue('Test feedback');
  });
});
