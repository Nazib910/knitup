import type { ReactNode } from 'react';

// Generic form field wrapper. Provides label, optional hint, and error display.
// Plays nicely with native inputs registered via react-hook-form.

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-knitup-gray mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </span>
      {children}
      {hint && !error && <span className="block text-xs text-knitup-light mt-1.5">{hint}</span>}
      {error && (
        <span role="alert" className="block text-xs text-red-500 mt-1.5">
          {error}
        </span>
      )}
    </label>
  );
}
