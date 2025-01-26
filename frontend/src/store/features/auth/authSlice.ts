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
import { addToast } from "../ui/uiSlice";

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
  { rejectValue: ApiError }
>(
  "auth/registerFaculty",
  async (registrationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/register",
        registrationData,
        { requiresAuth: false }
      );

      // Only handle success toast here
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        dispatch(
          addToast({
            type: "success",
            message:
              "Registration successful! Welcome to the Bonsai Research Engine!",
          })
        );
      }

      return response;
    } catch (error) {
      console.error("Registration API error:", error);
      if (error instanceof ApiError) {
        return rejectWithValue(error);
      }
      return rejectWithValue(
        new ApiError({
          message: "Registration failed. Please try again.",
          toastType: "error",
          toastDuration: 5000,
        })
      );
    }
  }
);

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ApiError }
>("auth/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials,
      { requiresAuth: false }
    );

    // Only handle success toast here
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      dispatch(
        addToast({
          type: "success",
          message: "Login successful, welcome back!",
        })
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "An unexpected error occurred. Please try again.",
        toastType: "error",
        toastDuration: 5000,
      })
    );
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
    handleTokenExpiration: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
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
      })
      .addCase(registerFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
      });
  },
});

export const { logout, setCredentials, handleTokenExpiration } =
  authSlice.actions;
export default authSlice.reducer;
