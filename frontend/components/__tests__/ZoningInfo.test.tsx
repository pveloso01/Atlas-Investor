import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import ZoningInfo from '../PropertyDetails/ZoningInfo';

describe('ZoningInfo', () => {
  it('renders zoning title', () => {
    render(<ZoningInfo />);
    expect(screen.getByText('Zoning & Development Potential')).toBeInTheDocument();
  });

  it('displays zoning type', () => {
    render(<ZoningInfo zoning="Residential Zone – R2" />);
    expect(screen.getByText('Residential Zone – R2')).toBeInTheDocument();
  });

  it('displays development potential score', () => {
    render(<ZoningInfo developmentPotential={8} />);
    expect(screen.getByText('Development Potential Score: 8/10')).toBeInTheDocument();
  });

  it('displays high development potential message', () => {
    render(<ZoningInfo developmentPotential={8} />);
    expect(screen.getByText('High development potential')).toBeInTheDocument();
  });

  it('displays moderate development potential message', () => {
    render(<ZoningInfo developmentPotential={6} />);
    expect(screen.getByText('Moderate development potential')).toBeInTheDocument();
  });

  it('displays limited development potential message', () => {
    render(<ZoningInfo developmentPotential={3} />);
    expect(screen.getByText('Limited development potential')).toBeInTheDocument();
  });

  it('displays development features', () => {
    render(<ZoningInfo />);
    expect(screen.getByText('Can add extension')).toBeInTheDocument();
    expect(screen.getByText('Eligible for short-term rental license')).toBeInTheDocument();
  });

  it('displays max floors information', () => {
    render(<ZoningInfo maxFloors={5} />);
    expect(screen.getByText(/Maximum 5 floors permitted/)).toBeInTheDocument();
  });

  it('displays high development potential with green color', () => {
    render(<ZoningInfo developmentPotential={8} />);
    expect(screen.getByText('High development potential')).toBeInTheDocument();
  });

  it('displays moderate development potential with yellow color', () => {
    render(<ZoningInfo developmentPotential={6} />);
    expect(screen.getByText('Moderate development potential')).toBeInTheDocument();
  });

  it('displays limited development potential with red color', () => {
    render(<ZoningInfo developmentPotential={3} />);
    expect(screen.getByText('Limited development potential')).toBeInTheDocument();
  });

  it('displays feature with checkmark when value is true', () => {
    render(<ZoningInfo canAddExtension={true} />);
    expect(screen.getByText('Can add extension')).toBeInTheDocument();
  });

  it('displays feature with info icon when value is false', () => {
    render(<ZoningInfo canAddExtension={false} />);
    expect(screen.getByText('Can add extension')).toBeInTheDocument();
  });

  it('displays short-term rental eligibility', () => {
    render(<ZoningInfo shortTermRentalEligible={true} />);
    expect(screen.getByText('Eligible for short-term rental license')).toBeInTheDocument();
  });

  it('displays development potential bar with success color for high potential', () => {
    render(<ZoningInfo developmentPotential={8} />);
    // Development potential >= 7 should show success color
    expect(screen.getByText('High development potential')).toBeInTheDocument();
  });

  it('displays development potential bar with warning color for moderate potential', () => {
    render(<ZoningInfo developmentPotential={6} />);
    // Development potential between 5 and 7 should show warning color
    expect(screen.getByText('Moderate development potential')).toBeInTheDocument();
  });

  it('displays development potential bar with error color for low potential', () => {
    render(<ZoningInfo developmentPotential={3} />);
    // Development potential < 5 should show error color
    expect(screen.getByText('Limited development potential')).toBeInTheDocument();
  });
});

