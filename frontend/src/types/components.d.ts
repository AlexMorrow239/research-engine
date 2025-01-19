import type { ModalType, ToastType } from "@/store/features/ui/uiSlice";

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
