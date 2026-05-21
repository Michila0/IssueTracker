import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean | undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...rest }, ref) => {
  const base = 'w-full rounded-2xl border bg-white/7 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400/70 focus:bg-white/10';
  const errorClass = error ? 'border-rose-400/70' : 'border-white/10';

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <input ref={ref} className={`${base} ${errorClass} ${className}`} {...rest} />
      {error && typeof error === 'string' && <p className="mt-1.5 text-xs text-rose-200">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
