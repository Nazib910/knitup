import { z } from 'zod';

// Zod schemas for all forms (PRD §3: react-hook-form + zod + @hookform/resolvers).

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number').optional().or(z.literal('')),
  brandName: z.string().max(80).optional().or(z.literal('')),
});

export const addressSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  recipient: z.string().min(2, 'Recipient name required'),
  line1: z.string().min(3, 'Address line 1 required'),
  line2: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City required'),
  region: z.string().min(1, 'State / region required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
  phone: z.string().min(7, 'Phone required'),
  isDefault: z.boolean(),
});

export const passwordSchema = z
  .object({
    current: z.string().min(1, 'Current password required'),
    next: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password required'),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirm: z.string(),
    accept: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
