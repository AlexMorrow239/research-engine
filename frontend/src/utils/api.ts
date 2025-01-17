import { RootState } from "@/store";
import { Store } from "@reduxjs/toolkit";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  fetch: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const { requiresAuth = false, ...fetchOptions } = options;
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}${endpoint}`;

    // Get auth token from store if required
    if (requiresAuth) {
      const store = (
        window as unknown as Window & { __REDUX_STORE__: Store<RootState> }
      ).__REDUX_STORE__;
      const state: RootState = store.getState();
      const token = state.auth.token;

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Add default headers
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "An error occurred",
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network error"
      );
    }
  },
};
