import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";

import { handleTokenExpiration } from "../features/auth/authSlice";

// Helper to check if payload is an ApiError-like object
const isApiErrorLike = (payload: unknown): payload is { status: number } => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "status" in payload &&
    typeof (payload as { status: unknown }).status === "number"
  );
};

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

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Only process rejected actions
  if (!isRejectedWithValue(action)) {
    return next(action);
  }

  const payload = action.payload;

  // Skip auth-related actions to prevent infinite loops
  if (isAuthAction(action.type)) {
    return next(action);
  }

  // Handle unauthorized responses
  if (isApiErrorLike(payload) && payload.status === 401) {
    // Clear token from localStorage
    localStorage.removeItem("accessToken");

    // Log the auth error (but not in production)
    if (process.env.NODE_ENV !== "production") {
      console.warn("Authentication error:", {
        type: action.type,
        payload: payload,
      });
    }

    // Update auth state
    store.dispatch(handleTokenExpiration());
  }

  return next(action);
};
