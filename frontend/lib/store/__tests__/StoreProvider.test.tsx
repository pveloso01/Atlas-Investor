import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import StoreProvider from '../StoreProvider';
import { useAppSelector } from '../hooks';

// Test component that uses the store
const TestComponent = () => {
  const propertyApiState = useAppSelector((state) => state.propertyApi);
  return <div>Store initialized: {propertyApiState ? 'Yes' : 'No'}</div>;
};

describe('StoreProvider', () => {
  it('renders children correctly', () => {
    render(
      <StoreProvider>
        <div>Test Content</div>
      </StoreProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides Redux store to children', () => {
    render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );
    
    expect(screen.getByText(/Store initialized: Yes/i)).toBeInTheDocument();
  });

  it('initializes store only once', () => {
    const { rerender } = render(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );
    
    expect(screen.getByText(/Store initialized: Yes/i)).toBeInTheDocument();
    
    rerender(
      <StoreProvider>
        <TestComponent />
      </StoreProvider>
    );
    
    // Should still work after rerender
    expect(screen.getByText(/Store initialized: Yes/i)).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <StoreProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </StoreProvider>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

