import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export interface Issue {
  _id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  user?: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  status: string;
  priority: string;
  severity: string;
  search: string;
}

interface IssueState {
  issues: Issue[];
  totalIssues: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: Filters;
  fetchIssues: (page?: number, limit?: number) => Promise<void>;
  createIssue: (issueData: Omit<Issue, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIssue: (id: string, issueData: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
  resetStore: () => void;
}

const initialFilters: Filters = {
  status: '',
  priority: '',
  severity: '',
  search: '',
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  totalIssues: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  filters: initialFilters,

  fetchIssues: async (page = 1, limit = 6) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.severity) params.severity = filters.severity;
      if (filters.search) params.search = filters.search;

      const response = await axiosInstance.get('/issues', { params });
      set({
        issues: response.data.issues,
        totalIssues: response.data.totalIssues,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch issues',
      });
    }
  },

  createIssue: async (issueData) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post('/issues', issueData);
      set({ loading: false });
      // Refetch issues for page 1 to display the newly created issue
      await get().fetchIssues(1);
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to create issue',
      });
      throw err;
    }
  },

  updateIssue: async (id, issueData) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.put(`/issues/${id}`, issueData);
      set({ loading: false });
      // Refetch issues for the current page
      await get().fetchIssues(get().currentPage);
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to update issue',
      });
      throw err;
    }
  },

  deleteIssue: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/issues/${id}`);
      set({ loading: false });
      // Refetch issues
      await get().fetchIssues(get().currentPage);
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to delete issue',
      });
      throw err;
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
    // Auto refetch issues when filter changes
    get().fetchIssues(1);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchIssues(1);
  },

  resetStore: () => {
    set({
      issues: [],
      totalIssues: 0,
      totalPages: 1,
      currentPage: 1,
      loading: false,
      error: null,
      filters: initialFilters,
    });
  },
}));
