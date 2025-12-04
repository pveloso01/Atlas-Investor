import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import HelpTooltip from '../Shared/HelpTooltip';
import userEvent from '@testing-library/user-event';

describe('HelpTooltip', () => {
  it('renders the tooltip icon', () => {
    render(<HelpTooltip title="Test Title" />);
    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeInTheDocument();
  });

  it('displays title in tooltip', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip title="Test Title" />);
    const iconButton = screen.getByRole('button');
    await user.hover(iconButton);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays description when provided', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip title="Test Title" description="Test Description" />);
    const iconButton = screen.getByRole('button');
    await user.hover(iconButton);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays glossary link when provided', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip title="Test Title" glossaryLink="/glossary" />);
    const iconButton = screen.getByRole('button');
    await user.hover(iconButton);
    const link = screen.getByText('Learn more in glossary →');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/glossary');
  });

  it('does not display description when not provided', async () => {
    const user = userEvent.setup();
    render(<HelpTooltip title="Test Title" />);
    const iconButton = screen.getByRole('button');
    await user.hover(iconButton);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});

