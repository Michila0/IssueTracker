import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIssueStore } from '../store/useIssueStore';
import type { Issue } from '../store/useIssueStore';

interface IssueFormProps {
  initialIssue?: Issue | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}

export const IssueForm: React.FC<IssueFormProps> = ({
  initialIssue,
  onSuccess,
  onCancel,
}) => {
  const { createIssue, updateIssue, loading, error } = useIssueStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
      priority: 'medium',
      status: 'open',
    },
  });

  // Watch fields for custom visual radio selection style
  const currentSeverity = watch('severity');
  const currentPriority = watch('priority');
  const currentStatus = watch('status');

  useEffect(() => {
    if (initialIssue) {
      reset({
        title: initialIssue.title,
        description: initialIssue.description,
        severity: initialIssue.severity,
        priority: initialIssue.priority,
        status: initialIssue.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        severity: 'medium',
        priority: 'medium',
        status: 'open',
      });
    }
  }, [initialIssue, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (initialIssue) {
        await updateIssue(initialIssue._id, data);
      } else {
        await createIssue(data);
      }
      onSuccess();
    } catch (err) {
      // Error handled in store
    }
  };

  const severities: FormValues['severity'][] = ['low', 'medium', 'high', 'critical'];
  const priorities: FormValues['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const statuses: FormValues['status'][] = ['open', 'in-progress', 'resolved', 'closed'];

  const severityColors = {
    low: 'border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:bg-emerald-950/20',
    medium: 'border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:bg-amber-950/20',
    high: 'border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-50 dark:border-orange-900/50 dark:text-orange-400 dark:bg-orange-950/20',
    critical: 'border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:bg-rose-950/20',
  };

  const severitySelectedColors = {
    low: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500 text-white dark:bg-emerald-600',
    medium: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500 text-white dark:bg-amber-600',
    high: 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500 text-white dark:bg-orange-600',
    critical: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500 text-white dark:bg-rose-600',
  };

  const priorityColors = {
    low: 'border-slate-200 text-slate-700 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:bg-slate-900/20',
    medium: 'border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:bg-blue-950/20',
    high: 'border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-50 dark:border-purple-900/50 dark:text-purple-400 dark:bg-purple-950/20',
    urgent: 'border-red-200 text-red-700 bg-red-50/50 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:bg-red-950/20',
  };

  const prioritySelectedColors = {
    low: 'border-slate-500 ring-2 ring-slate-500/20 bg-slate-500 text-white dark:bg-slate-600',
    medium: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500 text-white dark:bg-blue-600',
    high: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-500 text-white dark:bg-purple-600',
    urgent: 'border-red-500 ring-2 ring-red-500/20 bg-red-500 text-white dark:bg-red-600',
  };

  const statusColors = {
    open: 'border-sky-200 text-sky-700 bg-sky-50/50 hover:bg-sky-50 dark:border-sky-900/50 dark:text-sky-400 dark:bg-sky-950/20',
    'in-progress': 'border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:bg-indigo-950/20',
    resolved: 'border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-50 dark:border-teal-900/50 dark:text-teal-400 dark:bg-teal-950/20',
    closed: 'border-slate-200 text-slate-600 bg-slate-100/50 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900/30',
  };

  const statusSelectedColors = {
    open: 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500 text-white dark:bg-sky-600',
    'in-progress': 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500 text-white dark:bg-indigo-600',
    resolved: 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-500 text-white dark:bg-teal-600',
    closed: 'border-slate-500 ring-2 ring-slate-500/20 bg-slate-600 text-white dark:bg-slate-600',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Issue Title
        </label>
        <input
          type="text"
          placeholder="e.g., Database connection timed out on login"
          {...register('title', {
            required: 'A title is required',
            maxLength: { value: 100, message: 'Title must be 100 characters or less' },
          })}
          className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-4 ${
            errors.title
              ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-200 bg-slate-50/30 focus:border-violet-500 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900/50'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Provide a detailed description of the bug or task..."
          {...register('description', { required: 'A description is required' })}
          className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-4 ${
            errors.description
              ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-200 bg-slate-50/30 focus:border-violet-500 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900/50'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
            Severity
          </label>
          <div className="grid grid-cols-2 gap-2">
            {severities.map((sev) => {
              const isSelected = currentSeverity === sev;
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setValue('severity', sev)}
                  className={`inline-flex items-center justify-center rounded-xl border py-2.5 text-xs font-semibold capitalize tracking-wide transition-all ${
                    isSelected ? severitySelectedColors[sev] : severityColors[sev]
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priorities.map((prio) => {
              const isSelected = currentPriority === prio;
              return (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setValue('priority', prio)}
                  className={`inline-flex items-center justify-center rounded-xl border py-2.5 text-xs font-semibold capitalize tracking-wide transition-all ${
                    isSelected ? prioritySelectedColors[prio] : priorityColors[prio]
                  }`}
                >
                  {prio}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status (Only visible when editing) */}
      {initialIssue && (
        <div>
          <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statuses.map((stat) => {
              const isSelected = currentStatus === stat;
              return (
                <button
                  key={stat}
                  type="button"
                  onClick={() => setValue('status', stat)}
                  className={`inline-flex items-center justify-center rounded-xl border py-2.5 text-xs font-semibold capitalize tracking-wide transition-all ${
                    isSelected ? statusSelectedColors[stat] : statusColors[stat]
                  }`}
                >
                  {stat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 border-t border-slate-50 pt-6 dark:border-slate-800/80">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : initialIssue ? (
            'Save Changes'
          ) : (
            'Create Issue'
          )}
        </button>
      </div>
    </form>
  );
};
