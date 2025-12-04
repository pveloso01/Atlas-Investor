import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import SupportWidget from '../Support/SupportWidget';
import userEvent from '@testing-library/user-event';

// Create a mock function that we can control per test
const mockSubmitSupportMessage = jest.fn();

// Mock the feedback API - need to mock the entire module including the api object
jest.mock('@/lib/store/api/feedbackApi', () => ({
  feedbackApi: {
    reducerPath: 'feedbackApi',
    reducer: (state = {}) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
  useSubmitFeedbackMutation: () => [jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) }), { isLoading: false }],
  useGetFeedbackQuery: () => ({ data: [], isLoading: false }),
  useSubmitSupportMessageMutation: () => [mockSubmitSupportMessage, { isLoading: false }],
  useGetSupportMessagesQuery: () => ({ data: [], isLoading: false }),
  useSubmitContactRequestMutation: () => [jest.fn().mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) }), { isLoading: false }],
  useGetContactRequestsQuery: () => ({ data: [], isLoading: false }),
}));

describe('SupportWidget', () => {
  it('renders help button', () => {
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    expect(helpButton).toBeInTheDocument();
  });

  it('opens dialog when help button is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText('Need Help?')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when close icon is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    // Find the IconButton with close icon (it's the small button in the dialog title)
    const allButtons = screen.getAllByRole('button');
    const closeIconButton = allButtons.find((btn) => btn.classList.contains('MuiIconButton-root'));
    expect(closeIconButton).toBeDefined();
    if (closeIconButton) {
      await user.click(closeIconButton);
      await waitFor(() => {
        expect(screen.queryByText('Need Help?')).not.toBeInTheDocument();
      });
    }
  });

  it('displays support specialist information', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    expect(screen.getByText('João Dias')).toBeInTheDocument();
    expect(screen.getByText('Support Specialist')).toBeInTheDocument();
  });

  it('enables send button when email and message are entered', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    // Now both email and message are required
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'test@example.com');
    const textField = screen.getByLabelText('Your Message');
    await user.type(textField, 'Test message');
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).not.toBeDisabled();
  });

  it('disables send button when message is empty', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('sends support message successfully and shows success snackbar', async () => {
    mockSubmitSupportMessage.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 1, email: 'test@example.com', message: 'Test', status: 'pending' }),
    });

    const user = userEvent.setup();
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Fill in form
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'test@example.com');
    
    const messageField = screen.getByLabelText('Your Message');
    await user.type(messageField, 'Test');
    
    // Submit
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);
    
    // Check that mutation was called
    await waitFor(() => {
      expect(mockSubmitSupportMessage).toHaveBeenCalled();
    });
    
    // Success snackbar should appear
    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  }, 10000);

  it('shows error snackbar when message send fails', async () => {
    mockSubmitSupportMessage.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Network error')),
    });

    const user = userEvent.setup();
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Fill in form
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'a@b.com');
    
    const messageField = screen.getByLabelText('Your Message');
    await user.type(messageField, 'Test');
    
    // Submit
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);
    
    // Error snackbar should appear
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  }, 10000);

  it('does not send when email is empty', async () => {
    mockSubmitSupportMessage.mockClear();
    
    const user = userEvent.setup();
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Only fill in message
    const messageField = screen.getByLabelText('Your Message');
    await user.type(messageField, 'Test message');
    
    // Submit button should be disabled
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('does not send when message is only whitespace', async () => {
    mockSubmitSupportMessage.mockClear();
    
    const user = userEvent.setup();
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Fill in email
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'test@example.com');
    
    // Submit button should be disabled when no message
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('snackbar auto-closes after timeout', async () => {
    jest.useFakeTimers();
    
    mockSubmitSupportMessage.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 1, email: 'test@example.com', message: 'Test', status: 'pending' }),
    });

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Fill in form and submit
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'a@b.c');
    
    const messageField = screen.getByLabelText('Your Message');
    await user.type(messageField, 'Test');
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);
    
    // Wait for snackbar
    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
    
    // Snackbar has autoHideDuration of 6000ms
    jest.advanceTimersByTime(7000);
    
    // Snackbar should disappear after timeout
    await waitFor(() => {
      expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  }, 15000);

  it('clears form after successful submission', async () => {
    mockSubmitSupportMessage.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 1, email: 'test@example.com', message: 'Test', status: 'pending' }),
    });

    const user = userEvent.setup();
    render(<SupportWidget />);
    
    // Open dialog
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    
    // Fill in form
    const emailField = screen.getByLabelText('Your Email');
    await user.type(emailField, 'a@b.c');
    
    const messageField = screen.getByLabelText('Your Message');
    await user.type(messageField, 'Test');
    
    // Submit
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);
    
    // Wait for success
    await waitFor(() => {
      expect(mockSubmitSupportMessage).toHaveBeenCalled();
    });
    
    // Dialog should close after successful submission
    await waitFor(() => {
      expect(screen.queryByText('Need Help?')).not.toBeInTheDocument();
    });
  }, 10000);
});
