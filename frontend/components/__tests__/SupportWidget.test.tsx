import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
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

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportWidget />);
    const helpButton = screen.getByRole('button', { name: /help/i });
    await user.click(helpButton);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(screen.queryByText('Need Help?')).not.toBeInTheDocument();
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

