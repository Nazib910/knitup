import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from '@/components/forms/FormField';

describe('FormField', () => {
  it('renders label and required asterisk', () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows hint when no error', () => {
    render(
      <FormField label="Brand" hint="Used on order documents">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Used on order documents')).toBeInTheDocument();
  });

  it('shows error and hides hint when error is set', () => {
    render(
      <FormField label="Email" hint="We will not share" error="Required field">
        <input />
      </FormField>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    expect(screen.queryByText('We will not share')).not.toBeInTheDocument();
  });
});
