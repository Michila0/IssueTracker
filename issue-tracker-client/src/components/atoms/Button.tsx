import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[linear-gradient(135deg,#22d3ee,#6366f1)] text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.28)]',
  secondary: 'bg-white/6 text-white border border-white/10',
  ghost: 'bg-transparent text-white/80',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3.5 text-sm',
  lg: 'px-6 py-4 text-base',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const classes = `inline-flex w-full items-center justify-center gap-2 rounded-2xl transition-transform ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
