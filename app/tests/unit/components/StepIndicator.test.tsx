import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepIndicator } from '@/components/wizard/StepIndicator';

describe('StepIndicator', () => {
  it('renders 7 step dots with correct accessible label', () => {
    render(<StepIndicator currentStep={3} />);
    const list = screen.getByRole('list', { name: /Wizard progress, step 3 of 7/i });
    expect(list).toBeInTheDocument();
    // 7 list items
    expect(list.querySelectorAll('li')).toHaveLength(7);
  });

  it('marks the current step with aria-current', () => {
    const { container } = render(<StepIndicator currentStep={5} />);
    const current = container.querySelector('[aria-current="step"]');
    expect(current).not.toBeNull();
  });
});
