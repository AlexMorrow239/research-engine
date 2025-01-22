// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
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

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ModalData {
  type: ModalType;
  props?: Record<string, unknown>;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
