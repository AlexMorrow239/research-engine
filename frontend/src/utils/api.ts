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
    const { requiresAuth = true, ...fetchOptions } = options;
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = baseUrl.endsWith("/")
      ? `${baseUrl}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`
      : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Get auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem("token");

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

        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
        }

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
