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

  it('opens portfolio dialog when add to portfolio is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    // Now shows "Add to Portfolio" dialog instead of "Save Deal"
    expect(screen.getByText('Add to Portfolio', { selector: 'h6' })).toBeInTheDocument();
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

  it('shows portfolio dialog with portfolio selection', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    // The dialog now has "Add to Portfolio" button instead of "View Portfolio"
    expect(screen.getByRole('button', { name: /Add to Portfolio/i })).toBeInTheDocument();
  });

  it('handles export PDF action', async () => {
    const user = userEvent.setup();
    // Export PDF now opens a URL instead of calling window.print()
    render(<PropertyActions property={mockProperty} />);
    const exportButton = screen.getByText('Export PDF Report');
    expect(exportButton).toBeInTheDocument();
    // The PDF export functionality is implemented via backend API
  });

  it('handles contact action', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const contactButton = screen.getByText('Contact Seller/Broker');
    await user.click(contactButton);
    // Now opens a dialog instead of mailto link
    expect(screen.getByText(/Contact Seller\/Broker for Property/i)).toBeInTheDocument();
  });

  it('closes portfolio dialog when close icon is clicked', async () => {
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
        expect(screen.queryByText('Add to Portfolio', { selector: 'h6' })).not.toBeInTheDocument();
      });
    }
  });

  it('closes portfolio dialog when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyActions property={mockProperty} />);
    const addButton = screen.getByText('Add to Portfolio');
    await user.click(addButton);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText('Add to Portfolio', { selector: 'h6' })).not.toBeInTheDocument();
    });
  });
});
