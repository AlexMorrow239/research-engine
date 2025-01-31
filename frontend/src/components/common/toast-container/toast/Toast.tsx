import { useEffect, useState } from "react";

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import "./Toast.scss";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 200); // Wait for exit animation
    }, duration);

    return (): void => clearTimeout(timer);
  }, [duration, id, onClose]);

  return (
    <div className={`toast toast--${type} ${isExiting ? "toast--exit" : ""}`}>
      <Icon className="toast__icon" aria-hidden="true" />
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button
        className="toast__close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 200);
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
