import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';

type Mode = 'login' | 'register';

interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

export const AuthPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const { login, register: registerUser, loading, error } = useAuthStore();

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    reset({ name: '', email: '', password: '' });
  };

  const onSubmit = async (values: AuthFormValues) => {
    if (mode === 'login') {
      await login(values.email, values.password);
      return;
    }

    await registerUser(values.name, values.email, values.password);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,#050816_0%,#0b1022_55%,#10172d_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[54px_54px] opacity-20" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
            Secure issue workspace
          </div>
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Private issue tracking with polished authentication.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Sign in or create an account to manage your own private issues. Each workspace is isolated with JWT-backed access and encrypted passwords.
            </p>
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ['JWT sessions', '30-day signed access tokens'],
              ['bcrypt hashing', 'Passwords never stored in plain text'],
              ['Private data', 'Each account sees only its own issues'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl">
                <div className="mb-2 text-sm font-semibold text-white">{title}</div>
                <div className="text-sm leading-6 text-slate-300">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-cyan-400/20 blur-3xl" />
          <div className="rounded-4xl border border-white/12 bg-white/8 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:text-white'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:text-white'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    {...registerField('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    className={`w-full rounded-2xl border bg-white/7 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] ${errors.name ? 'border-rose-400/70' : 'border-white/10'}`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-rose-200">{errors.name.message}</p>}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...registerField('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`w-full rounded-2xl border bg-white/7 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] ${errors.email ? 'border-rose-400/70' : 'border-white/10'}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-200">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  placeholder="Enter a secure password"
                  {...registerField('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className={`w-full rounded-2xl border bg-white/7 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] ${errors.password ? 'border-rose-400/70' : 'border-white/10'}`}
                />
                {errors.password && <p className="mt-1.5 text-xs text-rose-200">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#6366f1)] px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.28)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
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
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};