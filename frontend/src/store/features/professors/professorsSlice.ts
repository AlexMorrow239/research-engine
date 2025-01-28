import type { Professor, ProfessorAccountUpdate } from "@/types";
import { api, ApiError } from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToast } from "../ui/uiSlice";

interface ProfessorState {
  professor: Professor | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfessorState = {
  professor: null,
  isLoading: false,
  error: null,
};

export const fetchProfessor = createAsyncThunk(
  "professors/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetch<Professor>("/api/professors/profile", {
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error);
      }
      return rejectWithValue(
        new ApiError({
          message: "Failed to fetch professor profile",
          toastType: "error",
        })
      );
    }
  }
);

export const updateProfessor = createAsyncThunk<
  Professor,
  ProfessorAccountUpdate,
  { rejectValue: ApiError }
>("professors/update", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.patch<Professor>(
      "/api/professors/profile",
      data
    );

    dispatch(
      addToast({
        type: "success",
        message: "Account updated successfully!",
      })
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "Failed to update account",
        toastType: "error",
      })
    );
  }
});

const professorsSlice = createSlice({
  name: "professors",
  initialState,
  reducers: {
    clearProfessor: (state) => {
      state.professor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Professor
      .addCase(fetchProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.professor = action.payload;
      })
      .addCase(fetchProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as ApiError)?.message || "An error occurred";
      })

      // Update Professor
      .addCase(updateProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.professor = action.payload;
      })
      .addCase(updateProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
      });
  },
});

export const { clearProfessor } = professorsSlice.actions;
export default professorsSlice.reducer;
