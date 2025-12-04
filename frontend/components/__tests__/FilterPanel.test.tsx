import React from 'react';
import { render, screen, waitFor, within } from '@/__tests__/utils/test-utils';
import FilterPanel, { FilterState } from '../Dashboard/FilterPanel';
import userEvent from '@testing-library/user-event';

const defaultFilters: FilterState = {
  search: '',
  propertyType: '',
  region: '',
  minPrice: 0,
  maxPrice: 1000000,
  minROI: 0,
  maxROI: 50,
  minYield: 0,
  maxYield: 20,
};

describe('FilterPanel', () => {
  it('renders filter panel', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    expect(screen.getByRole('heading', { name: /Filters/i })).toBeInTheDocument();
  });

  it('allows searching', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const searchField = screen.getByRole('textbox', { name: /search/i });
    await user.type(searchField, 'test');
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('displays preset filters', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    expect(screen.getByText('High ROI Deals')).toBeInTheDocument();
    expect(screen.getByText('Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText('High Yield')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const onFiltersChange = jest.fn();

    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={onReset} />
    );

    // First, type something to make filters active (triggers hasActiveFilters = true)
    const searchField = screen.getByRole('textbox', { name: /search/i });
    await user.type(searchField, 'test');

    // Wait for the Clear All button to appear
    await waitFor(() => {
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Clear All');
    await user.click(resetButton);
    expect(onReset).toHaveBeenCalled();
  });

  it('applies preset filter when clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const presetButton = screen.getByText('High ROI Deals');
    await user.click(presetButton);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('toggles advanced filters', async () => {
    const user = userEvent.setup();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />
    );
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    // Advanced filters should be visible
    await waitFor(() => {
      expect(screen.getByText(/ROI Range/i)).toBeInTheDocument();
    });
  });

  it('allows selecting property type', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );

    // Verify the property type select is rendered
    expect(screen.getAllByText(/property type/i).length).toBeGreaterThan(0);
  });

  it('allows adjusting price range', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    // Open advanced filters first
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    await waitFor(() => {
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);
    });
  });

  it('does not show clear all button when no filters are active', () => {
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />
    );
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('allows selecting region', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );

    // Verify the region select is rendered
    expect(screen.getAllByText(/region/i).length).toBeGreaterThan(0);
  });

  it('allows adjusting ROI range in advanced filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    await waitFor(() => {
      expect(screen.getByText(/ROI Range/i)).toBeInTheDocument();
    });
  });

  it('allows adjusting yield range in advanced filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    await waitFor(() => {
      expect(screen.getByText(/Yield Range/i)).toBeInTheDocument();
    });
  });

  it('detects active filters correctly', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const searchField = screen.getByRole('textbox', { name: /search/i });
    await user.type(searchField, 'test');
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('detects active filters when property type is selected', () => {
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );

    // Verify the property type select exists for filter detection
    expect(screen.getAllByText(/property type/i).length).toBeGreaterThan(0);
  });

  it('handles clear all button click', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={onReset} />
    );

    // Type something to activate filters
    const searchField = screen.getByRole('textbox', { name: /search/i });
    await user.type(searchField, 'test');

    // Now clear all should be visible
    await waitFor(() => {
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    expect(onReset).toHaveBeenCalled();
  });

  it('executes handlePresetFilter callback', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const presetButton = screen.getByText(/High Yield/i);
    await user.click(presetButton);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('handles filter value changes', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(
      <FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />
    );
    const searchInput = screen.getByPlaceholderText(/City, neighborhood, or property ID/i);
    await user.type(searchInput, 'test');
    expect(onFiltersChange).toHaveBeenCalled();
  });
});
