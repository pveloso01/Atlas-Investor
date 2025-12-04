import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import TestimonialsSection, { Testimonial } from '../Trust/TestimonialsSection';

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Investor',
    location: 'Lisbon',
    quote: 'Great platform!',
    rating: 5,
    customerSince: '2022',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Developer',
    location: 'Porto',
    quote: 'Very helpful.',
    rating: 4,
  },
];

describe('TestimonialsSection', () => {
  it('renders default title', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);
    expect(screen.getByText('Trusted by Real Estate Professionals')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders default subtitle', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);
    expect(screen.getByText('See what our users are saying')).toBeInTheDocument();
  });

  it('renders custom subtitle', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} subtitle="Custom Subtitle" />);
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders all testimonials', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);
    expect(screen.getByText('Great platform!')).toBeInTheDocument();
    expect(screen.getByText('Very helpful.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays rating stars when provided', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);
    // The rating stars are rendered as text content
    expect(screen.getByText('Great platform!')).toBeInTheDocument();
  });

  it('displays customer since when provided', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} />);
    expect(screen.getByText('Customer since 2022')).toBeInTheDocument();
  });

  it('limits testimonials when maxItems is provided', () => {
    render(<TestimonialsSection testimonials={mockTestimonials} maxItems={1} />);
    expect(screen.getByText('Great platform!')).toBeInTheDocument();
    expect(screen.queryByText('Very helpful.')).not.toBeInTheDocument();
  });
});

