import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import ProgressChecklist from '../Onboarding/ProgressChecklist';
import userEvent from '@testing-library/user-event';

const mockItems = [
  { id: '1', label: 'Item 1', completed: false },
  { id: '2', label: 'Item 2', completed: false },
  { id: '3', label: 'Item 3', completed: false },
];

describe('ProgressChecklist', () => {
  it('renders checklist with title', () => {
    render(<ProgressChecklist items={mockItems} />);
    expect(screen.getByText("Beginner's Checklist")).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ProgressChecklist title="Custom Title" items={mockItems} />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('displays all items', () => {
    render(<ProgressChecklist items={mockItems} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('shows progress correctly', () => {
    const itemsWithCompleted = [
      { id: '1', label: 'Item 1', completed: true },
      { id: '2', label: 'Item 2', completed: false },
      { id: '3', label: 'Item 3', completed: false },
    ];
    render(<ProgressChecklist items={itemsWithCompleted} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('calls onItemComplete when item is toggled', async () => {
    const user = userEvent.setup();
    const onItemComplete = jest.fn();
    render(<ProgressChecklist items={mockItems} onItemComplete={onItemComplete} />);
    const firstItem = screen.getByText('Item 1');
    await user.click(firstItem);
    expect(onItemComplete).toHaveBeenCalledWith('1');
  });

  it('calls onAllComplete when all items are completed', async () => {
    const user = userEvent.setup();
    const onAllComplete = jest.fn();
    const items = [
      { id: '1', label: 'Item 1', completed: false },
      { id: '2', label: 'Item 2', completed: false },
    ];
    render(<ProgressChecklist items={items} onAllComplete={onAllComplete} />);
    const item1 = screen.getByText('Item 1');
    const item2 = screen.getByText('Item 2');
    await user.click(item1);
    await user.click(item2);
    expect(onAllComplete).toHaveBeenCalled();
  });

  it('shows completion message when all items are completed', () => {
    const allCompleted = mockItems.map(item => ({ ...item, completed: true }));
    render(<ProgressChecklist items={allCompleted} />);
    expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
  });

  it('marks completed items with line-through', () => {
    const itemsWithCompleted = [
      { id: '1', label: 'Item 1', completed: true },
      { id: '2', label: 'Item 2', completed: false },
    ];
    render(<ProgressChecklist items={itemsWithCompleted} />);
    const completedItem = screen.getByText('Item 1');
    expect(completedItem).toHaveStyle({ textDecoration: 'line-through' });
  });
});

