import { removeToast } from "@/store/features/ui/uiSlice";

import { useAppDispatch, useAppSelector } from "@/store";
import { type ToastType } from "@/types";

import { Toast } from "./toast/Toast";

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  const handleClose = (id: string): void => {
    dispatch(removeToast(id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast: ToastType) => (
        <Toast key={toast.id} {...toast} onClose={handleClose} />
      ))}
    </div>
  );
};
