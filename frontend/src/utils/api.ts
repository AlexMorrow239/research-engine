interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  isFormData?: boolean;
}

export type ApiErrorType = "error" | "warning" | "info";

interface ApiErrorOptions {
  message: string;
  status?: number;
  data?: unknown;
  toastType?: ApiErrorType;
  toastDuration?: number;
}

export class ApiError extends Error {
  public status?: number;
  public data?: unknown;
  public toastType: ApiErrorType;
  public toastDuration: number;

  constructor({
    message,
    status,
    data,
    toastType = "error",
    toastDuration = 5000,
  }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.toastType = toastType;
    this.toastDuration = toastDuration;
  }
}

export const api = {
  fetch: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const {
      requiresAuth = true,
      isFormData = false,
      ...fetchOptions
    } = options;
    const baseUrl = import.meta.env.VITE_API_URL;

    // Construct URL, handling trailing slashes
    const url = baseUrl.endsWith("/")
      ? `${baseUrl}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`
      : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Initialize headers
    const headers = new Headers(fetchOptions.headers);

    // Handle Content-Type header
    if (isFormData) {
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "application/json");
    }

    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new ApiError({
          message: "Authentication required",
          status: 401,
          toastType: "error",
        });
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      // Prepare the request body
      let body = fetchOptions.body;
      if (body && !isFormData) {
        body = typeof body === "string" ? body : JSON.stringify(body);
      }

      const response = await fetch(url, {
        ...fetchOptions,
        body,
        headers,
        credentials: "include",
        mode: "cors",
      });

      const responseClone = response.clone();
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorData = {};

        if (contentType?.includes("application/json")) {
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: await responseClone.text() };
          }
        }

        // Handle specific status codes
        switch (response.status) {
          case 401:
            // Replace specific error messages with a generic one
            throw new ApiError({
              message:
                "Invalid credentials. Please check your email or password or register for a new account.",
              status: 401,
              data: errorData,
              toastType: "error",
              toastDuration: 5000,
            });
          case 403:
            throw new ApiError({
              message: "Access forbidden",
              status: 403,
              data: errorData,
            });

          case 404:
            throw new ApiError({
              message: "Resource not found",
              status: 404,
              data: errorData,
            });

          case 422:
            throw new ApiError({
              message: "Validation error",
              status: 422,
              data: errorData,
            });

          case 429:
            throw new ApiError({
              message: "Too many requests",
              status: 429,
              data: errorData,
              toastType: "warning",
              toastDuration: 6000,
            });

          default:
            throw new ApiError({
              message:
                (errorData as { message?: string }).message ||
                "An error occurred",
              status: response.status,
              data: errorData,
            });
        }
      }

      // Handle successful responses
      try {
        if (contentType?.includes("application/json")) {
          return await response.json();
        } else if (contentType?.includes("text/")) {
          return (await response.text()) as unknown as T;
        } else {
          return (await response.blob()) as unknown as T;
        }
      } catch (parseError) {
        console.error("Response parsing failed:", {
          error:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          contentType,
          endpoint,
        });

        try {
          if (contentType?.includes("application/json")) {
            return await responseClone.json();
          } else if (contentType?.includes("text/")) {
            return (await responseClone.text()) as unknown as T;
          } else {
            return (await responseClone.blob()) as unknown as T;
          }
        } catch (cloneParseError) {
          console.error("Clone parsing failed:", {
            error:
              cloneParseError instanceof Error
                ? cloneParseError.message
                : String(cloneParseError),
            contentType,
            endpoint,
          });
          throw new ApiError({
            message: "Failed to parse server response",
            status: 500,
            data: {
              originalError: parseError,
              cloneError: cloneParseError,
            },
          });
        }
      }
    } catch (error) {
      console.error("API Error:", {
        name: error instanceof Error ? error.name : "Unknown error",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new ApiError({
          message: "Network error: Unable to connect to server",
          status: 0,
          toastType: "error",
          toastDuration: 5000,
        });
      }

      throw new ApiError({
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        status: 0,
      });
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
    const { isFormData = false, ...rest } = options;
    return api.fetch<T>(endpoint, {
      ...rest,
      method: "POST",
      body: data as BodyInit,
      isFormData,
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
      body: data as BodyInit,
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
      body: data as BodyInit,
    });
  },

  delete: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    return api.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
