import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import AdvancedModeToggle from '../Shared/AdvancedModeToggle';
import userEvent from '@testing-library/user-event';

describe('AdvancedModeToggle', () => {
  it('renders with default disabled state', () => {
    render(<AdvancedModeToggle />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
  });

  it('renders with enabled state when defaultEnabled is true', () => {
    render(<AdvancedModeToggle defaultEnabled={true} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('displays advanced mode label', () => {
    render(<AdvancedModeToggle />);
    expect(screen.getByText('Advanced Mode')).toBeInTheDocument();
  });

  it('calls onToggle when switch is toggled', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<AdvancedModeToggle onToggle={onToggle} />);
    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('shows advanced analytics message when enabled', () => {
    render(<AdvancedModeToggle defaultEnabled={true} />);
    expect(screen.getByText('Showing advanced analytics')).toBeInTheDocument();
  });

  it('does not show advanced analytics message when disabled', () => {
    render(<AdvancedModeToggle defaultEnabled={false} />);
    expect(screen.queryByText('Showing advanced analytics')).not.toBeInTheDocument();
  });
});

