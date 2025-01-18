import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LoginCredentials,
  AuthResponse,
  User,
  FacultyRegistrationForm,
} from "@/types/api";
import { AuthState } from "@/types/global";
import { api, ApiError } from "@/utils/api";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const registerFaculty = createAsyncThunk<
  AuthResponse,
  Omit<FacultyRegistrationForm, "confirmPassword" | "firstName" | "lastName">,
  { rejectValue: string }
>("auth/registerFaculty", async (registrationData, { rejectWithValue }) => {
  try {
    const response = await api.fetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registrationData),
      requiresAuth: false,
    });

    // Store token in localStorage for API utility
    localStorage.setItem("token", response.token);

    return response;
  } catch (error) {
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
    const response = await api.fetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      requiresAuth: false,
    });

    // Store token in localStorage for API utility
    localStorage.setItem("token", response.token);

    return response;
  } catch (error) {
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
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
