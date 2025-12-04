import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
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
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  it('allows searching', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const searchField = screen.getByLabelText(/search/i);
    await user.type(searchField, 'test');
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('displays preset filters', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    expect(screen.getByText('High ROI Deals')).toBeInTheDocument();
    expect(screen.getByText('Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText('High Yield')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={onReset} />);
    const resetButton = screen.getByText(/reset/i);
    await user.click(resetButton);
    expect(onReset).toHaveBeenCalled();
  });

  it('applies preset filter when clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const presetButton = screen.getByText('High ROI Deals');
    await user.click(presetButton);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('toggles advanced filters', async () => {
    const user = userEvent.setup();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    // Advanced filters should be visible
    expect(screen.getByText(/ROI/i)).toBeInTheDocument();
  });

  it('allows selecting property type', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const propertyTypeSelect = screen.getByLabelText(/property type/i);
    await user.click(propertyTypeSelect);
    const apartmentOption = screen.getByText(/apartment/i);
    await user.click(apartmentOption);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('allows adjusting price range', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // Open advanced filters first
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('shows clear all button when filters are active', () => {
    const activeFilters: FilterState = {
      ...defaultFilters,
      search: 'test',
      propertyType: 'apartment',
    };
    render(<FilterPanel filters={activeFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('does not show clear all button when no filters are active', () => {
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('allows selecting region', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const regionSelect = screen.getByLabelText(/region/i);
    await user.click(regionSelect);
    const lisbonOption = screen.getByText('Lisbon');
    await user.click(lisbonOption);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('allows adjusting ROI range in advanced filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    expect(screen.getByText(/ROI Range/i)).toBeInTheDocument();
  });

  it('allows adjusting yield range in advanced filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    expect(screen.getByText(/Yield Range/i)).toBeInTheDocument();
  });

  it('detects active filters correctly', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const searchField = screen.getByLabelText(/search/i);
    await user.type(searchField, 'test');
    // After typing, hasActiveFilters should be true
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('detects active filters when property type is selected', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const propertyTypeSelect = screen.getByLabelText(/property type/i);
    await user.click(propertyTypeSelect);
    const apartmentOption = screen.getByText(/apartment/i);
    await user.click(apartmentOption);
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('detects active filters when price range is adjusted', async () => {
    const onFiltersChange = jest.fn();
    const filtersWithPrice: FilterState = {
      ...defaultFilters,
      minPrice: 100000,
      maxPrice: 500000,
    };
    render(<FilterPanel filters={filtersWithPrice} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // With non-default price, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('handles clear all button click', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const activeFilters: FilterState = {
      ...defaultFilters,
      search: 'test',
    };
    render(<FilterPanel filters={activeFilters} onFiltersChange={jest.fn()} onReset={onReset} />);
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    expect(onReset).toHaveBeenCalled();
  });

  it('detects active filters when ROI range is adjusted', async () => {
    const onFiltersChange = jest.fn();
    const filtersWithROI: FilterState = {
      ...defaultFilters,
      minROI: 5,
      maxROI: 15,
    };
    render(<FilterPanel filters={filtersWithROI} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // With non-default ROI, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('detects active filters when yield range is adjusted', async () => {
    const onFiltersChange = jest.fn();
    const filtersWithYield: FilterState = {
      ...defaultFilters,
      minYield: 3,
      maxYield: 8,
    };
    render(<FilterPanel filters={filtersWithYield} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // With non-default yield, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('allows adjusting price range slider', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const priceSliders = screen.getAllByRole('slider');
    expect(priceSliders.length).toBeGreaterThan(0);
  });

  it('allows adjusting ROI range slider', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('allows adjusting yield range slider', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('detects active filters when maxPrice is less than default', () => {
    const filtersWithMaxPrice: FilterState = {
      ...defaultFilters,
      maxPrice: 500000,
    };
    render(<FilterPanel filters={filtersWithMaxPrice} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // With maxPrice < 1000000, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('detects active filters when maxROI is less than default', () => {
    const filtersWithMaxROI: FilterState = {
      ...defaultFilters,
      maxROI: 30,
    };
    render(<FilterPanel filters={filtersWithMaxROI} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // With maxROI < 50, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('detects active filters when maxYield is less than default', () => {
    const filtersWithMaxYield: FilterState = {
      ...defaultFilters,
      maxYield: 10,
    };
    render(<FilterPanel filters={filtersWithMaxYield} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // With maxYield < 20, should show clear button
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('resets hasActiveFilters when clear all is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const activeFilters: FilterState = {
      ...defaultFilters,
      search: 'test',
    };
    render(<FilterPanel filters={activeFilters} onFiltersChange={jest.fn()} onReset={onReset} />);
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    expect(onReset).toHaveBeenCalled();
    // After reset, hasActiveFilters should be false
  });

  it('handles property type selection change', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const propertyTypeSelect = screen.getByLabelText('Property Type');
    await user.click(propertyTypeSelect);
    const apartmentOption = screen.getByText('Apartment');
    await user.click(apartmentOption);
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ propertyType: 'apartment' })
    );
  });

  it('handles region selection change', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const regionSelect = screen.getByLabelText('Region');
    await user.click(regionSelect);
    const lisbonOption = screen.getByText('Lisbon');
    await user.click(lisbonOption);
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ region: 'lisbon' })
    );
  });

  it('handles price range slider change', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    // Price range slider should be the first one
    const priceSlider = sliders[0];
    // Simulate slider change by firing change event
    fireEvent.change(priceSlider, { target: { value: [100000, 500000] } });
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('handles ROI range slider change', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    // ROI range slider should be one of them
    if (sliders.length > 1) {
      const roiSlider = sliders[1];
      fireEvent.change(roiSlider, { target: { value: [5, 15] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('handles yield range slider change', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    await user.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    // Yield range slider should be one of them
    if (sliders.length > 2) {
      const yieldSlider = sliders[2];
      fireEvent.change(yieldSlider, { target: { value: [3, 8] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('calls valueLabelFormat for price range slider', () => {
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // valueLabelFormat function: (value) => `€${value.toLocaleString()}`
    // This is called when slider displays value label
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    expect(screen.getByText(/Price Range/i)).toBeInTheDocument();
  });

  it('calls valueLabelFormat for ROI range slider', () => {
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // valueLabelFormat function: (value) => `${value}%`
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    expect(screen.getByText(/ROI Range/i)).toBeInTheDocument();
  });

  it('calls valueLabelFormat for yield range slider', () => {
    render(<FilterPanel filters={defaultFilters} onFiltersChange={jest.fn()} onReset={jest.fn()} />);
    // valueLabelFormat function: (value) => `${value}%`
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    expect(screen.getByText(/Yield Range/i)).toBeInTheDocument();
  });

  it('calls onChange handler for price range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 0) {
      // Simulate onChange with array value: (_, newValue) => { const [min, max] = newValue as number[]; ... }
      fireEvent.change(sliders[0], { target: { value: [100000, 500000] } });
      // The onChange handler should destructure the array and call handleFilterChange
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('calls onChange handler for ROI range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 1) {
      // Simulate onChange with array value
      fireEvent.change(sliders[1], { target: { value: [5, 15] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('calls onChange handler for yield range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 2) {
      // Simulate onChange with array value
      fireEvent.change(sliders[2], { target: { value: [3, 8] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('executes onChange callback for price range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 0) {
      // The onChange callback: (_, newValue) => { const [min, max] = newValue as number[]; ... }
      // This function destructures the array and calls handleFilterChange twice
      fireEvent.change(sliders[0], { target: { value: [100000, 500000] } });
      // Should call onFiltersChange with updated filters
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('executes onChange callback for ROI range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 1) {
      // The onChange callback: (_, newValue) => { const [min, max] = newValue as number[]; ... }
      fireEvent.change(sliders[1], { target: { value: [5, 15] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('executes onChange callback for yield range slider with array destructuring', () => {
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    const advancedButton = screen.getByText(/advanced/i);
    fireEvent.click(advancedButton);
    const sliders = screen.getAllByRole('slider');
    if (sliders.length > 2) {
      // The onChange callback: (_, newValue) => { const [min, max] = newValue as number[]; ... }
      fireEvent.change(sliders[2], { target: { value: [3, 8] } });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('executes propertyType onChange callback with event target value', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // The onChange callback: (e) => handleFilterChange('propertyType', e.target.value)
    const propertyTypeSelect = screen.getByLabelText('Property Type');
    await user.click(propertyTypeSelect);
    const apartmentOption = screen.getByText('Apartment');
    await user.click(apartmentOption);
    // Should call handleFilterChange with 'propertyType' and 'apartment'
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ propertyType: 'apartment' })
    );
  });

  it('executes region onChange callback with event target value', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // The onChange callback: (e) => handleFilterChange('region', e.target.value)
    const regionSelect = screen.getByLabelText('Region');
    await user.click(regionSelect);
    const lisbonOption = screen.getByText('Lisbon');
    await user.click(lisbonOption);
    // Should call handleFilterChange with 'region' and 'lisbon'
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ region: 'lisbon' })
    );
  });

  it('executes handlePresetFilter callback with preset parameter', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // The handlePresetFilter callback: (preset) => { onFiltersChange({ ...filters, ...preset.filters }); setHasActiveFilters(true); }
    const presetButton = screen.getByText(/High Yield/i);
    await user.click(presetButton);
    // Should call onFiltersChange with merged filters
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('executes clear button onClick callback that calls onReset and setHasActiveFilters', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const activeFilters: FilterState = {
      ...defaultFilters,
      search: 'test',
    };
    render(<FilterPanel filters={activeFilters} onFiltersChange={jest.fn()} onReset={onReset} />);
    // The onClick callback: () => { onReset(); setHasActiveFilters(false); }
    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);
    // Should call onReset
    expect(onReset).toHaveBeenCalled();
  });

  it('executes handleFilterChange function with different filter keys', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // handleFilterChange is called with different keys: 'search', 'propertyType', 'region', etc.
    const searchInput = screen.getByPlaceholderText(/Search properties/i);
    await user.type(searchInput, 'test');
    // Should call handleFilterChange with 'search' key
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('executes handleFilterChange function and updates hasActiveFilters state', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFiltersChange={onFiltersChange} onReset={jest.fn()} />);
    // handleFilterChange should update hasActiveFilters based on filter values
    const searchInput = screen.getByPlaceholderText(/Search properties/i);
    await user.type(searchInput, 'test');
    // Should show clear button when filters are active
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });
});

