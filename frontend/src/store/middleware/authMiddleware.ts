import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { handleTokenExpiration } from "../features/auth/authSlice";

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Check if the action is a rejected API call
  if (isRejectedWithValue(action)) {
    // Check if the error is due to an expired/invalid token (usually 401 status)
    if (
      "status" in (action.payload as Record<string, unknown>) &&
      (action.payload as Record<string, unknown>).status === 401
    ) {
      // Clear token from localStorage
      localStorage.removeItem("accessToken");

      // Dispatch action to update auth state
      store.dispatch(handleTokenExpiration());
    }
  }

  return next(action);
};
