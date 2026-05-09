import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, App as AntdApp } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { signupSchema, type SignupFormData } from '@/lib/schemas';
import { FormField } from '@/components/forms/FormField';

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const { notification } = AntdApp.useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirm: '', accept: false as unknown as true },
  });

  const onSubmit = async (data: SignupFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthUser({
      id: `u-${Date.now().toString(36)}`,
      name: data.fullName,
      email: data.email,
    });
    notification.success({ message: 'Welcome to KnitStudio', description: data.fullName });
    navigate('/design/studio');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-5 py-16"
    >
      <h1 className="text-h2 font-display text-knitup-gray mb-2">Sign Up</h1>
      <p className="text-knitup-light mb-8 text-sm">
        Create your KnitStudio account. v0 is a visual stub — your data lives only in this browser.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Full name" error={errors.fullName?.message} required>
          <input
            {...register('fullName')}
            autoComplete="name"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.fullName}
          />
        </FormField>
        <FormField label="Email" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.email}
          />
        </FormField>
        <FormField label="Password" error={errors.password?.message} required hint="At least 8 chars, with an uppercase letter and a number">
          <input
            {...register('password')}
            type="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.password}
          />
        </FormField>
        <FormField label="Confirm password" error={errors.confirm?.message} required>
          <input
            {...register('confirm')}
            type="password"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.confirm}
          />
        </FormField>

        <label className="flex items-start gap-2 text-sm text-knitup-text">
          <input type="checkbox" {...register('accept')} className="mt-0.5" />
          <span>
            I accept the{' '}
            <Link to="/terms-and-conditions" className="underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.accept && (
          <p role="alert" className="text-xs text-red-500">
            {errors.accept.message}
          </p>
        )}

        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-knitup-light mt-6">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-knitup-gray font-semibold underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
