import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import LoadingAnimations from '../Shared/LoadingAnimations';

describe('LoadingAnimations', () => {
  it('renders spinner by default', () => {
    render(<LoadingAnimations />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingAnimations message="Custom loading message" />);
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('renders house animation when type is house', () => {
    render(<LoadingAnimations type="house" message="Loading properties" />);
    expect(screen.getByText('Loading properties')).toBeInTheDocument();
  });

  it('renders progress animation with milestones', () => {
    const milestones = ['Step 1', 'Step 2', 'Step 3'];
    render(
      <LoadingAnimations
        type="progress"
        message="Processing"
        milestones={milestones}
        currentMilestone={1}
      />
    );
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders progress animation without milestones as spinner', () => {
    render(<LoadingAnimations type="progress" message="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});

