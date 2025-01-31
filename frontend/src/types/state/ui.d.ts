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

export interface ToastType {
  id: string;
  message: string;
  type: "error" | "success" | "warning" | "info";
  duration?: number;
}

export interface ModalData {
  type: string;
  props?: Record<string, unknown>;
}
