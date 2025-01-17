import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export type ModalType =
  | "createProject"
  | "editProject"
  | "confirmDelete"
  | "viewApplication"
  | "confirmStatusUpdate";

interface ModalData {
  type: ModalType;
  props?: Record<string, unknown>;
}

interface UIState {
  modals: {
    active: ModalData | null;
  };
  toasts: Toast[];
  sidebar: {
    isOpen: boolean;
  };
  theme: "light" | "dark";
  globalLoading: boolean;
}

const initialState: UIState = {
  modals: {
    active: null,
  },
  toasts: [],
  sidebar: {
    isOpen: true,
  },
  theme: "light",
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Modal actions
    showModal: (state, action: PayloadAction<ModalData>) => {
      state.modals.active = action.payload;
    },
    hideModal: (state) => {
      state.modals.active = null;
    },

    // Toast actions
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },

    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },

    // Loading state actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  showModal,
  hideModal,
  addToast,
  removeToast,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  setGlobalLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
