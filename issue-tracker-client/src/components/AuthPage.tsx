import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthForm } from './organisms/AuthForm';

type Mode = 'login' | 'register';

export const AuthPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const { login, register: registerUser, loading, error } = useAuthStore();

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
  };

  const onSubmit = async (values: { name?: string; email: string; password: string }) => {
    if (mode === 'login') {
      await login(values.email, values.password);
      return;
    }

    await registerUser(values.name || '', values.email, values.password);
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

            <AuthForm mode={mode} loading={loading} error={error} onSubmit={onSubmit} />
          </div>
        </section>
      </div>
    </main>
  );
};