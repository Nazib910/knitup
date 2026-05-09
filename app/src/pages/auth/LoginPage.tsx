import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, App as AntdApp, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleOutlined, AppleFilled } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { FormField } from '@/components/forms/FormField';

// Login (visual stub). PRD §17 Q3 — auth skipped in v0. Submitting populates
// the auth store with a fake user so the header dropdown switches to authed.
export default function LoginPage() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const { notification } = AntdApp.useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthUser({
      id: `u-${Date.now().toString(36)}`,
      name: data.email.split('@')[0],
      email: data.email,
    });
    notification.success({ message: 'Welcome back', description: data.email });
    navigate('/design/studio');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-5 py-16"
    >
      <h1 className="text-h2 font-display text-knitup-gray mb-2">Log In</h1>
      <p className="text-knitup-light mb-8 text-sm">
        Welcome back. Auth is a visual stub in v0 (PRD §17 Q3) — any email + password works.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Email" error={errors.email?.message} required>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
          />
        </FormField>
        <FormField label="Password" error={errors.password?.message} required>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className="w-full px-3 py-2 border border-knitup-lighter rounded focus:outline-none focus:border-knitup-gray transition-colors"
            aria-invalid={!!errors.password}
          />
        </FormField>

        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
          Log In
        </Button>
      </form>

      <Divider plain>
        <span className="text-knitup-light text-xs">or continue with</span>
      </Divider>

      <div className="grid grid-cols-2 gap-3">
        <Button icon={<GoogleOutlined />} block disabled>
          Google
        </Button>
        <Button icon={<AppleFilled />} block disabled>
          Apple
        </Button>
      </div>

      <p className="text-center text-sm text-knitup-light mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/auth/signup" className="text-knitup-gray font-semibold underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
