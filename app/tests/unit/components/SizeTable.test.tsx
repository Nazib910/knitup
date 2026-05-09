import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SizeTable } from '@/components/ui/SizeTable';
import { useSelectionStore } from '@/store/selection';

const sizes = [
  { size: 'M' as const, length: 73, chest: 122, shoulder: 58, sleeveLength: 88, bottomOpening: 104 },
];

describe('SizeTable', () => {
  beforeEach(() => useSelectionStore.getState().reset());

  it('renders rows with cm values', () => {
    render(<SizeTable sizes={sizes} />);
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('73.0')).toBeInTheDocument();
    expect(screen.getByText('122.0')).toBeInTheDocument();
  });

  it('toggles to inches on click and converts values', () => {
    render(<SizeTable sizes={sizes} />);
    const toggle = screen.getByLabelText(/Switch unit to inches/i);
    fireEvent.click(toggle);
    // 73 cm = 28.74 in, 122 cm = 48.03 in
    expect(screen.getByText('28.74')).toBeInTheDocument();
    expect(screen.getByText('48.03')).toBeInTheDocument();
  });
});
