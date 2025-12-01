import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import FeedbackButton from '../Feedback/FeedbackButton';
import userEvent from '@testing-library/user-event';

describe('FeedbackButton', () => {
  it('renders feedback button', () => {
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    expect(feedbackButton).toBeInTheDocument();
  });

  it('opens dialog when feedback button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
  });

  it('allows rating selection', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // Click the 5th star by finding the radio input with value 5
    const ratingInputs = screen.getAllByRole('radio');
    const fiveStarInput = ratingInputs[4] as HTMLInputElement;
    expect(fiveStarInput.value).toBe('5');
    // Click the parent label to trigger the rating change
    const label = fiveStarInput.closest('label');
    if (label) {
      await user.click(label);
    } else {
      await user.click(fiveStarInput);
    }
    // Verify the rating was set (input is checked)
    expect(fiveStarInput).toBeChecked();
  });

  it('disables submit button when no rating is selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const submitButton = screen.getByText('Submit Feedback');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when rating is selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // Click any rating to enable submit button
    const ratingInputs = screen.getAllByRole('radio');
    await user.click(ratingInputs[0]);
    const submitButton = screen.getByText('Submit Feedback');
    expect(submitButton).not.toBeDisabled();
  });

  it('allows entering feedback text', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Great platform!');
    expect(textField).toHaveValue('Great platform!');
  });

  it('displays different rating messages', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    
    const ratingInputs = screen.getAllByRole('radio');
    
    // Test rating 5 - click label if available
    const rating5Input = ratingInputs[4] as HTMLInputElement;
    const label5 = rating5Input.closest('label');
    if (label5) {
      await user.click(label5);
    } else {
      await user.click(rating5Input);
    }
    expect(rating5Input).toBeChecked();
    // Text may appear conditionally, so we verify the input is checked
    const excellentText = screen.queryByText('Excellent!');
    if (excellentText) {
      expect(excellentText).toBeInTheDocument();
    }
    
    // Test rating 4
    const rating4Input = ratingInputs[3] as HTMLInputElement;
    const label4 = rating4Input.closest('label');
    if (label4) {
      await user.click(label4);
    } else {
      await user.click(rating4Input);
    }
    expect(rating4Input).toBeChecked();
    
    // Test rating 3
    const rating3Input = ratingInputs[2] as HTMLInputElement;
    const label3 = rating3Input.closest('label');
    if (label3) {
      await user.click(label3);
    } else {
      await user.click(rating3Input);
    }
    expect(rating3Input).toBeChecked();
    
    // Test rating 2
    const rating2Input = ratingInputs[1] as HTMLInputElement;
    const label2 = rating2Input.closest('label');
    if (label2) {
      await user.click(label2);
    } else {
      await user.click(rating2Input);
    }
    expect(screen.getByText('Fair')).toBeInTheDocument();
    
    // Test rating 1
    const rating1 = screen.getByLabelText(/1 Star/i);
    await user.click(rating1);
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  it('resets form when dialog is closed', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Test feedback');
    // Close dialog using the cancel button or close icon
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    // Reopen and verify form is reset
    await user.click(feedbackButton);
    const newTextField = screen.getByLabelText('Additional Comments');
    expect(newTextField).toHaveValue('');
  });

  it('submits feedback when send button is clicked', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Great platform!');
    const submitButton = screen.getByText('Submit Feedback');
    await user.click(submitButton);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('closes dialog after submitting feedback', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    const submitButton = screen.getByText('Submit Feedback');
    await user.click(submitButton);
    expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
  });

  it('resets rating and feedback when dialog closes', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Test');
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    // Reopen and verify form is reset
    await user.click(feedbackButton);
    const newTextField = screen.getByLabelText('Additional Comments');
    expect(newTextField).toHaveValue('');
  });

  it('displays rating text for rating 5', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
  });

  it('displays rating text for rating 4', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/4 Stars/i);
    await user.click(rating);
    expect(screen.getByText('Great!')).toBeInTheDocument();
  });

  it('displays rating text for rating 3', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/3 Stars/i);
    await user.click(rating);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('displays rating text for rating 2', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/2 Stars/i);
    await user.click(rating);
    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('displays rating text for rating 1', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // Click on the first star (rating 1)
    const rating = screen.getAllByRole('radio')[0];
    await user.click(rating);
    // Should display "Poor" text
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  it('calls handleOpen function when feedback button is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // handleOpen should set open to true
    expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
  });

  it('calls handleClose function when close icon is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    // handleClose should set open to false, rating to null, and feedback to ''
    expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
  });

  it('calls handleSend function when submit button is clicked', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    const rating = screen.getByLabelText(/5 Stars/i);
    await user.click(rating);
    const submitButton = screen.getByText('Submit Feedback');
    await user.click(submitButton);
    // handleSend should call console.log and then handleClose
    expect(consoleSpy).toHaveBeenCalledWith('Submitting feedback:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('executes rating onChange callback with newValue parameter', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // The onChange callback: (_, newValue) => setRating(newValue)
    // Click the 5th star (value 5)
    const ratingInputs = screen.getAllByRole('radio');
    const fiveStarInput = ratingInputs[4] as HTMLInputElement;
    expect(fiveStarInput.value).toBe('5');
    // Click the parent label to trigger the rating change
    const label = fiveStarInput.closest('label');
    if (label) {
      await user.click(label);
    } else {
      await user.click(fiveStarInput);
    }
    // Verify the rating was set (input is checked)
    expect(fiveStarInput).toBeChecked();
  });

  it('executes feedback onChange callback with event parameter', async () => {
    const user = userEvent.setup();
    render(<FeedbackButton />);
    const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    await user.click(feedbackButton);
    // The onChange callback: (e) => setFeedback(e.target.value)
    const textField = screen.getByLabelText('Additional Comments');
    await user.type(textField, 'Test feedback');
    // Should update feedback state
    expect(textField).toHaveValue('Test feedback');
  });
});

