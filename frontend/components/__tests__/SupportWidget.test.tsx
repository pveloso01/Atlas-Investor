import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import SupportWidget from '../Support/SupportWidget';
import userEvent from '@testing-library/user-event';

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

  it('enables send button when message is entered', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
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
});
