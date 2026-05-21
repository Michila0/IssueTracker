import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string | boolean | undefined;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-slate-200">{label}</label>}
      {children}
      {error && typeof error === 'string' && <p className="mt-1.5 text-xs text-rose-200">{error}</p>}
    </div>
  );
};

export default FormField;
