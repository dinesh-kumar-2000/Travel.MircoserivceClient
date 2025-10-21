import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

interface Sidebar {
  isOpen: boolean;
  type: 'navigation' | 'filters' | 'cart' | null;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Modals
  modals: Modal[];
  activeModal: string | null;

  // Sidebar
  sidebar: Sidebar;

  // Toasts
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;

  // Mobile menu
  mobileMenuOpen: boolean;

  // Search bar
  searchBarFocused: boolean;

  // Scroll position
  scrollY: number;
  showScrollTop: boolean;

  // Breadcrumbs
  breadcrumbs: Array<{ label: string; path: string }>;

  // Page title
  pageTitle: string;
  pageDescription: string;
}

const initialState: UIState = {
  modals: [],
  activeModal: null,
  sidebar: {
    isOpen: false,
    type: null,
  },
  toasts: [],
  globalLoading: false,
  loadingMessage: null,
  mobileMenuOpen: false,
  searchBarFocused: false,
  scrollY: 0,
  showScrollTop: false,
  breadcrumbs: [],
  pageTitle: '',
  pageDescription: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modals
    openModal: (state, action: PayloadAction<{ id: string; data?: any }>) => {
      const { id, data } = action.payload;
      const existingModal = state.modals.find((m) => m.id === id);

      if (existingModal) {
        existingModal.isOpen = true;
        existingModal.data = data;
      } else {
        state.modals.push({ id, isOpen: true, data });
      }

      state.activeModal = id;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modal = state.modals.find((m) => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
      if (state.activeModal === action.payload) {
        state.activeModal = null;
      }
    },
    closeAllModals: (state) => {
      state.modals.forEach((modal) => {
        modal.isOpen = false;
      });
      state.activeModal = null;
    },

    // Sidebar
    openSidebar: (
      state,
      action: PayloadAction<'navigation' | 'filters' | 'cart'>
    ) => {
      state.sidebar.isOpen = true;
      state.sidebar.type = action.payload;
    },
    closeSidebar: (state) => {
      state.sidebar.isOpen = false;
      state.sidebar.type = null;
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },

    // Toasts
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Global loading
    setGlobalLoading: (
      state,
      action: PayloadAction<{ loading: boolean; message?: string }>
    ) => {
      state.globalLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || null;
    },

    // Mobile menu
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    // Search bar
    setSearchBarFocused: (state, action: PayloadAction<boolean>) => {
      state.searchBarFocused = action.payload;
    },

    // Scroll
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
      state.showScrollTop = action.payload > 300;
    },

    // Breadcrumbs
    setBreadcrumbs: (
      state,
      action: PayloadAction<Array<{ label: string; path: string }>>
    ) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (
      state,
      action: PayloadAction<{ label: string; path: string }>
    ) => {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    // Page meta
    setPageMeta: (
      state,
      action: PayloadAction<{ title: string; description?: string }>
    ) => {
      state.pageTitle = action.payload.title;
      state.pageDescription = action.payload.description || '';
    },

    // Reset UI state
    resetUI: () => initialState,
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setMobileMenuOpen,
  toggleMobileMenu,
  setSearchBarFocused,
  setScrollY,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  setPageMeta,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
