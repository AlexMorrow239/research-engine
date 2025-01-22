import type {
  AuthResponse,
  AuthState,
  FacultyRegistrationForm,
  LoginCredentials,
  Professor,
  User,
} from "@/types";
import { api, ApiError } from "@/utils/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to convert Professor to User
const professorToUser = (professor: Professor): User => ({
  id: professor._id || "",
  email: professor.email,
  firstName: professor.name.firstName,
  lastName: professor.name.lastName,
});

export const registerFaculty = createAsyncThunk<
  AuthResponse,
  Omit<FacultyRegistrationForm, "confirmPassword" | "firstName" | "lastName">,
  { rejectValue: string }
>("auth/registerFaculty", async (registrationData, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>(
      "/api/auth/register",
      registrationData,
      { requiresAuth: false }
    );

    // Store accessToken in localStorage for API utility
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  } catch (error) {
    console.error("Registration API error:", error);
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Registration failed. Please try again.");
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials,
      { requiresAuth: false }
    );

    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  } catch (error) {
    console.error("Login error in thunk:", {
      error,
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      isApiError: error instanceof ApiError,
    });
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Login failed. Please try again.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = professorToUser(action.payload.professor);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Registration cases
      .addCase(registerFaculty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = professorToUser(action.payload.professor);
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(registerFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
