import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

type Mode = 'login' | 'register';

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  mode: Mode;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: AuthFormValues) => Promise<void> | void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, loading = false, error, onSubmit }) => {
  const { register, handleSubmit, reset, formState } = useForm<AuthFormValues>({ defaultValues: { name: '', email: '', password: '' } });

  React.useEffect(() => {
    reset({ name: '', email: '', password: '' });
  }, [mode, reset]);

  const submit = async (values: AuthFormValues) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>}

      {mode === 'register' && (
        <Input label="Full name" placeholder="Alex Morgan" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} />
      )}

      <Input label="Email" type="email" placeholder="you@company.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />

      <Input label="Password" type="password" placeholder="Enter a secure password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            Please wait
          </>
        ) : mode === 'login' ? (
          'Enter dashboard'
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
