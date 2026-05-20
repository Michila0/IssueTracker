import React from 'react';
import type { Issue } from '../store/useIssueStore';

interface IssueCardProps {
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
    case 'high':
      return 'bg-orange-50/80 text-orange-700 border-orange-200/60 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50';
    case 'critical':
      return 'bg-rose-50/80 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
    case 'medium':
    default:
      return 'bg-amber-50/80 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-slate-50/80 text-slate-700 border-slate-200/60 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50';
    case 'high':
      return 'bg-purple-50/80 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50';
    case 'urgent':
      return 'bg-red-50/80 text-red-700 border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50';
    case 'medium':
    default:
      return 'bg-blue-50/80 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50';
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50';
    case 'resolved':
      return 'bg-teal-50/80 text-teal-700 border-teal-200/60 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50';
    case 'closed':
      return 'bg-slate-100/80 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800/80';
    case 'open':
    default:
      return 'bg-sky-50/80 text-sky-700 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50';
  }
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onEdit, onDelete }) => {
  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:border-violet-900/40">
      
      {/* Dynamic Background Hover Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/0 via-fuchsia-500/0 to-sky-500/0 opacity-0 transition-opacity duration-500 group-hover:from-violet-500/[0.02] group-hover:to-sky-500/[0.02] group-hover:opacity-100 dark:group-hover:from-violet-500/[0.05] dark:group-hover:to-sky-500/[0.05]" />

      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Header badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide transition-colors ${getStatusStyles(issue.status)}`}>
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {issue.status}
            </span>

            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide ${getPriorityStyles(issue.priority)}`}>
              Priority: {issue.priority}
            </span>

            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide ${getSeverityStyles(issue.severity)}`}>
              Severity: {issue.severity}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-800 transition-colors group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400">
            {issue.title}
          </h3>

          {/* Description */}
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {issue.description}
          </p>
        </div>

        {/* Footer info & Action buttons */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Created {formattedDate}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(issue)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:text-violet-400"
              title="Edit Issue"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(issue._id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:text-rose-400"
              title="Delete Issue"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
