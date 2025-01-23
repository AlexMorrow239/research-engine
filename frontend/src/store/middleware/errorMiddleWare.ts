import { ApiError } from "@/utils/api";
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { logout } from "../features/auth/authSlice";
import { addToast, type ToastType } from "../features/ui/uiSlice";
import type { AppDispatch } from "../index";

// Helper to check if action is an auth-related action
const isAuthAction = (actionType: string): boolean => {
  const authActions = ["auth/login", "auth/registerFaculty"];
  return authActions.some((action) => actionType.startsWith(action));
};

// Helper to handle session expiration
const handleSessionExpiration = (store: { dispatch: AppDispatch }): void => {
  store.dispatch(logout());
  store.dispatch(
    addToast({
      message: "Your session has expired. Please log in again.",
      type: "error",
    })
  );
};

// Helper to create error toast from ApiError
const createErrorToast = (
  error: ApiError
): { message: string; type: ToastType; duration: number } => ({
  message: error.message,
  type: error.toastType,
  duration: error.toastDuration,
});

export const errorMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    if (!isRejectedWithValue(action)) {
      return next(action);
    }

    const payload = action.payload;

    // Enhanced error logging
    console.error("Redux Error:", {
      type: action.type,
      payload,
      error: action.error,
      meta: action.meta,
      arg: action.meta?.arg,
    });

    if (payload instanceof ApiError) {
      // Log API errors with details
      console.error("API Error:", {
        message: payload.message,
        status: payload.status,
        data: payload.data,
      });

      // Handle authentication errors
      if (payload.status === 401 && !isAuthAction(action.type)) {
        handleSessionExpiration(store);
        return next(action);
      }

      // Display the error toast using ApiError properties
      store.dispatch(addToast(createErrorToast(payload)));
    } else {
      // Handle non-ApiError rejections
      store.dispatch(
        addToast({
          message:
            typeof payload === "string"
              ? payload
              : "An unexpected error occurred",
          type: "error",
          duration: 5000,
        })
      );
    }

    return next(action);
  };
