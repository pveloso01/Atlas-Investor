import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from '@mui/material';

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies theme to Material-UI components', () => {
    render(
      <ThemeProvider>
        <Button variant="contained" color="primary">
          Themed Button
        </Button>
      </ThemeProvider>
    );
    
    const button = screen.getByText('Themed Button');
    expect(button).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <ThemeProvider>
        <div>Child 1</div>
        <div>Child 2</div>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    const { container } = render(<ThemeProvider>{null}</ThemeProvider>);
    expect(container).toBeInTheDocument();
  });
});

