import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, App as AntdApp } from 'antd';
import { AccountShell } from './AccountShell';
import { useAccountStore } from '@/store/account';
import { profileSchema, type ProfileFormData } from '@/lib/schemas';
import { FormField } from '@/components/forms/FormField';

export default function ProfilePage() {
  const profile = useAccountStore((s) => s.profile);
  const setProfile = useAccountStore((s) => s.setProfile);
  const { notification } = AntdApp.useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setProfile(data);
    reset(data);
    notification.success({
      message: 'Profile saved',
      description: 'Stored locally — visual stub in v0 (PRD §17 Q3).',
      placement: 'topRight',
    });
  };

  return (
    <AccountShell active="profile" title="Account Profile" subtitle="Manage your personal details and brand info.">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5" noValidate>
        <FormField label="Full name" error={errors.fullName?.message} required>
          <input
            {...register('fullName')}
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            placeholder="Jane Doe"
            aria-invalid={!!errors.fullName}
          />
        </FormField>
        <FormField label="Email address" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
          />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            placeholder="+1 555 0100"
            aria-invalid={!!errors.phone}
          />
        </FormField>
        <FormField label="Brand name" error={errors.brandName?.message} hint="Used on order documents and your store">
          <input
            {...register('brandName')}
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            placeholder="Knit Atelier"
            aria-invalid={!!errors.brandName}
          />
        </FormField>

        <div className="pt-2">
          <Button type="primary" htmlType="submit" size="large" loading={isSubmitting} disabled={!isDirty}>
            Save changes
          </Button>
        </div>
      </form>
    </AccountShell>
  );
}
