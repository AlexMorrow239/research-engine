import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";

import { ApiError } from "@/utils/api";

import { logout } from "../features/auth/authSlice";
import { addToast, type ToastType } from "../features/ui/uiSlice";
import type { AppDispatch } from "../index";

// Constants for error handling
const ERROR_CONSTANTS = {
  DEFAULT_DURATION: 5000,
  SESSION_EXPIRED_MESSAGE: "Your session has expired. Please log in again.",
  UNEXPECTED_ERROR_MESSAGE: "An unexpected error occurred",
} as const;

// Helper to check if action is an auth-related action
const isAuthAction = (actionType: string): boolean => {
  const authActions = [
    "auth/login",
    "auth/registerFaculty",
    "auth/requestPasswordReset",
    "auth/resetPassword",
  ];
  return authActions.some((action) => actionType.startsWith(action));
};

// Helper to handle session expiration
const handleSessionExpiration = (store: { dispatch: AppDispatch }): void => {
  localStorage.removeItem("accessToken");
  store.dispatch(logout());
  store.dispatch(
    addToast({
      message: ERROR_CONSTANTS.SESSION_EXPIRED_MESSAGE,
      type: "warning",
      duration: ERROR_CONSTANTS.DEFAULT_DURATION,
    })
  );
};

// Helper to create error toast from ApiError
const createErrorToast = (
  error: ApiError
): { message: string; type: ToastType; duration: number } => ({
  message: error.message,
  type: error.toastType,
  duration: error.toastDuration || ERROR_CONSTANTS.DEFAULT_DURATION,
});

// Helper to create generic error toast
const createGenericErrorToast = (
  message: string = ERROR_CONSTANTS.UNEXPECTED_ERROR_MESSAGE
) => ({
  message,
  type: "error" as ToastType,
  duration: ERROR_CONSTANTS.DEFAULT_DURATION,
});

// Helper to log error details in development
const logError = (
  action: {
    type: string;
    error?: unknown;
    meta?: {
      arg?: unknown;
      [key: string]: unknown;
    };
  },
  payload: unknown
): void => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Redux Error:", {
      type: action.type,
      payload,
      error: action.error,
      meta: action.meta,
      arg: action.meta?.arg,
    });
  }
};

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (!isRejectedWithValue(action)) {
    return next(action);
  }

  const payload = action.payload;
  logError(action, payload);

  if (payload instanceof ApiError) {
    // Handle authentication errors first
    if (payload.status === 401 && !isAuthAction(action.type)) {
      handleSessionExpiration(store);
      return next(action);
    }

    // Show toast for non-401 errors
    if (payload.status !== 401) {
      store.dispatch(addToast(createErrorToast(payload)));
    }
  } else {
    // Handle non-ApiError rejections
    store.dispatch(
      addToast(
        createGenericErrorToast(
          typeof payload === "string" ? payload : undefined
        )
      )
    );
  }

  return next(action);
};
