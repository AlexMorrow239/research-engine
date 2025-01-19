import { ApiError } from "@/utils/api";
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { logout } from "../features/auth/authSlice";
import { addToast } from "../features/ui/uiSlice";

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    let errorMessage = "An error occurred";
    const payload = action.payload;

    // Add detailed logging
    console.error("Redux Error:", {
      type: action.type,
      payload,
      error: action.error,
    });

    if ((payload as ApiError) instanceof ApiError) {
      errorMessage = (payload as ApiError).message;

      // Log API errors
      console.error("API Error:", {
        message: (payload as ApiError).message,
        status: (payload as ApiError).status,
      });

      if ((payload as ApiError).status === 401) {
        store.dispatch(logout());
        store.dispatch(
          addToast({
            message: "Your session has expired. Please log in again.",
            type: "error",
          })
        );
        return next(action);
      }
    } else if (typeof payload === "string") {
      errorMessage = payload;
    }

    store.dispatch(
      addToast({
        message: errorMessage,
        type: "error",
        duration: 5000,
      })
    );
  }

  return next(action);
};
