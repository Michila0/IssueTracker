import { useEffect, useState } from 'react';
import { useIssueStore } from './store/useIssueStore';
import type { Issue } from './store/useIssueStore';
import { IssueCard } from './components/IssueCard';
import { IssueForm } from './components/IssueForm';

function App() {
  const {
    issues,
    totalIssues,
    totalPages,
    currentPage,
    loading,
    error,
    filters,
    fetchIssues,
    deleteIssue,
    setFilter,
    resetFilters,
  } = useIssueStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch issues on load and when page changes
  useEffect(() => {
    fetchIssues(1);
  }, []);

  // Debounced search input handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilter('search', searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCreateOpen = () => {
    setEditingIssue(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (issue: Issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      try {
        await deleteIssue(id);
      } catch (err) {
        // Handled in store
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchIssues(newPage);
    }
  };

  // Mock statistics for the header
  const openCount = issues.filter((i) => i.status === 'open').length;
  const inProgressCount = issues.filter((i) => i.status === 'in-progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Visual background ambient details */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-900/10" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-900/10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              IssueTracker
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateOpen}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 sm:px-4 text-sm font-semibold text-white shadow-md shadow-violet-500/10 transition-all hover:from-violet-700 hover:to-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">New Issue</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="mb-8 rounded-3xl border border-slate-100 bg-white/40 p-6 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-900/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                Manage Project Issues
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                Track, coordinate, and resolve software bugs and feature requests. Refined with high performance filters.
              </p>
            </div>
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full md:w-auto">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm min-w-[80px] sm:min-w-[95px] dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="block text-2xl font-black text-violet-600 dark:text-violet-400">{totalIssues}</span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Total</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm min-w-[80px] sm:min-w-[95px] dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="block text-2xl font-black text-sky-500">{openCount}</span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Open</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm min-w-[80px] sm:min-w-[95px] dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="block text-2xl font-black text-indigo-500">{inProgressCount}</span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Progress</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm min-w-[80px] sm:min-w-[95px] dark:border-slate-800/60 dark:bg-slate-900/60">
                <span className="block text-2xl font-black text-emerald-500">{resolvedCount}</span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search issues title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm transition-all focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-violet-500"
              />
            </div>

            {/* Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="relative w-full lg:w-auto">
                <select
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium transition-all focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Severity Filter */}
              <div className="relative w-full lg:w-auto">
                <select
                  value={filters.severity}
                  onChange={(e) => setFilter('severity', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium transition-all focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Priority Filter */}
              <div className="relative w-full lg:w-auto">
                <select
                  value={filters.priority}
                  onChange={(e) => setFilter('priority', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium transition-all focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.status || filters.severity || filters.priority || filters.search) && (
                <button
                  onClick={resetFilters}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors w-full sm:w-auto text-center col-span-full lg:w-auto"
                >
                  Clear Filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Content Section */}
        {loading && issues.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4">
            <svg
              className="h-10 w-10 animate-spin text-violet-600"
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
            <span className="text-sm font-medium text-slate-500">Loading issues...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/40 p-8 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Issues Found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {filters.search || filters.status || filters.priority || filters.severity
                ? 'Try resetting or altering your filters.'
                : "Get started by creating your very first issue."}
            </p>
            {!filters.search && !filters.status && !filters.priority && !filters.severity && (
              <button
                onClick={handleCreateOpen}
                className="mt-6 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/10 hover:bg-violet-700"
              >
                Create First Issue
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  onEdit={handleEditOpen}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal - Create/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {editingIssue ? 'Edit Issue' : 'Create New Issue'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-100 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <IssueForm
              initialIssue={editingIssue}
              onSuccess={() => {
                setIsModalOpen(false);
                setEditingIssue(null);
              }}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingIssue(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
