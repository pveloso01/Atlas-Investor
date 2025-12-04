import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import PropertyActions from '../PropertyDetails/PropertyActions';
import { Property } from '@/types/property';
import userEvent from '@testing-library/user-event';

const mockProperty: Property = {
  id: 1,
  address: '123 Test St',
  price: '300000',
  size_sqm: '100',
  property_type: 'apartment',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('PropertyActions', () => {
  it('renders save button', () => {
    render(<PropertyActions property={mockProperty} />);
    expect(screen.getByText('Save this Deal')).toBeInTheDocument();
  });

  it('renders export PDF button', () => {
    render(<PropertyActions property={mockProperty} />);
    expect(screen.getByText('Export PDF Report')).toBeInTheDocument();
  });

  it('renders contact button', () => {
    render(<PropertyActions property={mockProperty} />);
    expect(screen.getByText('Contact Seller/Broker')).toBeInTheDocument();
  });

  it('changes save button text when saved', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const saveButton = screen.getByText('Save this Deal');
    await user.click(saveButton);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('opens invest dialog when invest button is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const investButton = screen.getByText(/Invest \/ Buy Now/i);
    await user.click(investButton);
    expect(screen.getByText('Confirm Investment')).toBeInTheDocument();
  });

  it('opens save dialog when add to portfolio is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    expect(screen.getByText('Save Deal')).toBeInTheDocument();
  });

  it('closes invest dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const investButton = screen.getByText(/Invest \/ Buy Now/i);
    await user.click(investButton);

    // Find the close IconButton in the invest dialog
    const allButtons = screen.getAllByRole('button');
    const closeIconButton = allButtons.find((btn) => btn.classList.contains('MuiIconButton-root'));
    expect(closeIconButton).toBeDefined();
    if (closeIconButton) {
      await user.click(closeIconButton);
      await waitFor(() => {
        expect(screen.queryByText('Confirm Investment')).not.toBeInTheDocument();
      });
    }
  });

  it('displays property address in invest dialog', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const investButton = screen.getByText(/Invest \/ Buy Now/i);
    await user.click(investButton);
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('displays property price in invest dialog', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const investButton = screen.getByText(/Invest \/ Buy Now/i);
    await user.click(investButton);
    // Portuguese locale formats currency differently
    expect(screen.getByText(/300/)).toBeInTheDocument();
  });

  it('allows proceeding to payment', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const investButton = screen.getByText(/Invest \/ Buy Now/i);
    await user.click(investButton);
    const proceedButton = screen.getByText('Proceed to Payment');
    await user.click(proceedButton);
    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Confirm Investment')).not.toBeInTheDocument();
    });
  });

  it('allows viewing portfolio from save dialog', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    const viewPortfolioButton = screen.getByText('View Portfolio');
    await user.click(viewPortfolioButton);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('handles export PDF action', async () => {
    const user = userEvent.setup();
    const printSpy = jest.spyOn(window, 'print').mockImplementation();
    render(<PropertyActions property={mockProperty} />);
    const exportButton = screen.getByText('Export PDF Report');
    await user.click(exportButton);
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  it('handles contact action', async () => {
    const user = userEvent.setup();
    // Mock window.location
    const originalLocation = window.location;
    delete (window as { location?: Location }).location;
    (window as { location: { href: string } }).location = { href: '' };
    render(<PropertyActions property={mockProperty} />);
    const contactButton = screen.getByText('Contact Seller/Broker');
    await user.click(contactButton);
    // Should set location.href to mailto link
    expect((window as { location: { href: string } }).location.href).toContain('mailto:');
    // Restore original location
    (window as { location?: Location }).location = originalLocation;
  });

  it('closes save dialog when close icon is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);

    // Find the close IconButton
    const allButtons = screen.getAllByRole('button');
    const closeIconButton = allButtons.find((btn) => btn.classList.contains('MuiIconButton-root'));
    expect(closeIconButton).toBeDefined();
    if (closeIconButton) {
      await user.click(closeIconButton);
      await waitFor(() => {
        expect(screen.queryByText('Save Deal')).not.toBeInTheDocument();
      });
    }
  });

  it('closes save dialog when Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    const closeButton = screen.getByRole('button', { name: /^Close$/i });
    await user.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Save Deal')).not.toBeInTheDocument();
    });
  });
});
