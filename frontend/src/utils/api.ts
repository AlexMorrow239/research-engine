interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  fetch: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const { requiresAuth = true, ...fetchOptions } = options;
    const baseUrl = import.meta.env.VITE_API_URL;

    // Construct URL, handling trailing slashes
    const url = baseUrl.endsWith("/")
      ? `${baseUrl}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`
      : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Initialize headers
    const headers = new Headers({
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    });

    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new ApiError("Authentication required", 401);
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
        mode: "cors",
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorData = {};

        if (contentType?.includes("application/json")) {
          errorData = await response.json().catch(() => ({}));
        }

        // Handle specific status codes
        switch (response.status) {
          case 401:
            localStorage.removeItem("accessToken"); // Clear invalid token
            break;
          case 403:
            throw new ApiError("Access forbidden", 403, errorData);
          case 404:
            throw new ApiError("Resource not found", 404, errorData);
          case 422:
            throw new ApiError("Validation error", 422, errorData);
          case 429:
            throw new ApiError("Too many requests", 429, errorData);
          default:
            throw new ApiError(
              (errorData as { message?: string }).message ||
                "An error occurred",
              response.status,
              errorData
            );
        }
      }

      // Handle successful responses
      if (contentType?.includes("application/json")) {
        return await response.json();
      } else if (contentType?.includes("text/")) {
        const textResponse = await response.text();
        return textResponse as unknown as T;
      } else {
        const blobResponse = await response.blob();
        return blobResponse as unknown as T;
      }
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new ApiError("Network error: Unable to connect to server", 0);
      }

      throw new ApiError(
        error instanceof Error ? error.message : "An unexpected error occurred",
        0
      );
    }
  },

  // Helper methods for common HTTP methods
  get: async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    return api.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  post: async <T>(
    endpoint: string,
    data: unknown,
    options: FetchOptions = {}
  ): Promise<T> => {
    return api.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put: async <T>(
    endpoint: string,
    data: unknown,
    options: FetchOptions = {}
  ): Promise<T> => {
    return api.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch: async <T>(
    endpoint: string,
    data: unknown,
    options: FetchOptions = {}
  ): Promise<T> => {
    return api.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    return api.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
