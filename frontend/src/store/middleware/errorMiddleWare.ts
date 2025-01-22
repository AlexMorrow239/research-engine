import { ApiError } from "@/utils/api";
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { logout } from "../features/auth/authSlice";
import { addToast } from "../features/ui/uiSlice";

export const errorMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    if (isRejectedWithValue(action)) {
      let errorMessage = "An error occurred";
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
        errorMessage = payload.message;

        // Log API errors with details
        console.error("API Error:", {
          message: payload.message,
          status: payload.status,
          data: payload.data,
        });

        if (payload.status === 401) {
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
