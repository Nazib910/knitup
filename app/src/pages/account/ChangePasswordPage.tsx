import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, App as AntdApp } from 'antd';
import { AccountShell } from './AccountShell';
import { passwordSchema, type PasswordFormData } from '@/lib/schemas';
import { FormField } from '@/components/forms/FormField';

export default function ChangePasswordPage() {
  const { notification } = AntdApp.useApp();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: '', next: '', confirm: '' },
  });

  const onSubmit = async (_data: PasswordFormData) => {
    // Visual stub — no real backend (PRD §17 Q3).
    await new Promise((r) => setTimeout(r, 400));
    reset();
    notification.success({
      message: 'Password updated',
      description: 'Visual stub — no real backend in v0.',
      placement: 'topRight',
    });
  };

  return (
    <AccountShell
      active="password"
      title="Change Password"
      subtitle="Use a strong password — at least 8 chars, with an uppercase letter and a number."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5" noValidate>
        <FormField label="Current password" error={errors.current?.message} required>
          <input
            {...register('current')}
            type="password"
            autoComplete="current-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.current}
          />
        </FormField>
        <FormField label="New password" error={errors.next?.message} required>
          <input
            {...register('next')}
            type="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.next}
          />
        </FormField>
        <FormField label="Confirm new password" error={errors.confirm?.message} required>
          <input
            {...register('confirm')}
            type="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.confirm}
          />
        </FormField>
        <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AccountShell>
  );
}
