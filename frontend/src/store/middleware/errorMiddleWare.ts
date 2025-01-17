import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import { addToast } from "../features/ui/uiSlice";
import { logout } from "../features/auth/authSlice";
import { ApiError } from "@/utils/api";

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  // Handle rejected actions from thunks
  if (isRejectedWithValue(action)) {
    let errorMessage = "An error occurred";
    const payload = action.payload;

    // Handle API errors
    if ((payload as ApiError) instanceof ApiError) {
      errorMessage = (payload as ApiError).message;

      // Handle authentication errors
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

    // Dispatch error toast
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
