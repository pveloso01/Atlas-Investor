import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import FeatureGate from '../Shared/FeatureGate';
import userEvent from '@testing-library/user-event';

describe('FeatureGate', () => {
  it('renders children when not locked', () => {
    render(
      <FeatureGate featureName="Test Feature" isLocked={false}>
        <div>Unlocked Content</div>
      </FeatureGate>
    );
    expect(screen.getByText('Unlocked Content')).toBeInTheDocument();
    expect(screen.queryByText('Test Feature')).not.toBeInTheDocument();
  });

  it('renders locked state when locked', () => {
    render(
      <FeatureGate featureName="Test Feature" isLocked={true}>
        <div>Locked Content</div>
      </FeatureGate>
    );
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Pro to access this feature')).toBeInTheDocument();
  });

  it('displays custom upgrade message', () => {
    render(
      <FeatureGate
        featureName="Test Feature"
        isLocked={true}
        upgradeMessage="Custom message"
      >
        <div>Locked Content</div>
      </FeatureGate>
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('calls onUpgrade when button is clicked', async () => {
    const user = userEvent.setup();
    const onUpgrade = jest.fn();
    render(
      <FeatureGate
        featureName="Test Feature"
        isLocked={true}
        onUpgrade={onUpgrade}
      >
        <div>Locked Content</div>
      </FeatureGate>
    );
    const button = screen.getByText('See Plans');
    await user.click(button);
    expect(onUpgrade).toHaveBeenCalledTimes(1);
  });

  it('does not show upgrade button when onUpgrade is not provided', () => {
    render(
      <FeatureGate featureName="Test Feature" isLocked={true}>
        <div>Locked Content</div>
      </FeatureGate>
    );
    expect(screen.queryByText('See Plans')).not.toBeInTheDocument();
  });
});

