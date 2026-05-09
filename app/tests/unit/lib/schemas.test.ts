import { describe, it, expect } from 'vitest';
import {
  profileSchema,
  addressSchema,
  passwordSchema,
  loginSchema,
  signupSchema,
} from '@/lib/schemas';

describe('profileSchema', () => {
  it('accepts a complete profile', () => {
    const r = profileSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+61 400 000 000',
      brandName: 'Knit Atelier',
    });
    expect(r.success).toBe(true);
  });

  it('rejects invalid emails', () => {
    const r = profileSchema.safeParse({ fullName: 'Jane', email: 'not-an-email', phone: '', brandName: '' });
    expect(r.success).toBe(false);
  });

  it('rejects too-short names', () => {
    const r = profileSchema.safeParse({ fullName: 'J', email: 'j@x.com', phone: '', brandName: '' });
    expect(r.success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('rejects weak passwords', () => {
    const r = passwordSchema.safeParse({ current: 'old', next: 'short', confirm: 'short' });
    expect(r.success).toBe(false);
  });

  it('rejects mismatched confirm', () => {
    const r = passwordSchema.safeParse({ current: 'old', next: 'GoodPass1', confirm: 'GoodPass2' });
    expect(r.success).toBe(false);
  });

  it('accepts strong matching passwords', () => {
    const r = passwordSchema.safeParse({ current: 'old', next: 'GoodPass1', confirm: 'GoodPass1' });
    expect(r.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('requires email + password', () => {
    expect(loginSchema.safeParse({ email: '', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'x@x.com', password: 'p' }).success).toBe(true);
  });
});

describe('signupSchema', () => {
  it('requires terms acceptance', () => {
    const r = signupSchema.safeParse({
      fullName: 'Jane',
      email: 'j@x.com',
      password: 'GoodPass1',
      confirm: 'GoodPass1',
      accept: false,
    });
    expect(r.success).toBe(false);
  });

  it('accepts a complete signup', () => {
    const r = signupSchema.safeParse({
      fullName: 'Jane Doe',
      email: 'j@x.com',
      password: 'GoodPass1',
      confirm: 'GoodPass1',
      accept: true,
    });
    expect(r.success).toBe(true);
  });
});

describe('addressSchema', () => {
  it('rejects too-short fields', () => {
    expect(
      addressSchema.safeParse({
        id: 'a1',
        label: '',
        recipient: '',
        line1: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false,
      }).success,
    ).toBe(false);
  });

  it('accepts a complete address', () => {
    const r = addressSchema.safeParse({
      id: 'a1',
      label: 'Home',
      recipient: 'Jane Doe',
      line1: '1 Knit Lane',
      city: 'Sydney',
      region: 'NSW',
      postalCode: '2000',
      country: 'AU',
      phone: '+61400000000',
      isDefault: true,
    });
    expect(r.success).toBe(true);
  });
});
