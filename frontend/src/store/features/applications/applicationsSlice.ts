import { type ApplicationStatus } from "@/common/enums";
import type { ApiResponse, Application } from "@/types";
import { api } from "@/utils/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ApplicationsState {
  items: Application[];
  currentApplication: Application | null;
  totalApplications: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    projectId?: string;
    status?: ApplicationStatus;
    page: number;
    limit: number;
  };
}

const initialState: ApplicationsState = {
  items: [],
  currentApplication: null,
  totalApplications: 0,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// Create Application
export const createApplication = createAsyncThunk(
  "applications/create",
  async (
    {
      projectId,
      formData,
    }: {
      projectId: string;
      formData: FormData;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Application>(
        `/api/projects/${projectId}/applications`,
        formData,
        {
          isFormData: true,
          requiresAuth: false,
        }
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create application");
    }
  }
);

// Fetch Applications for a Project
export const fetchApplications = createAsyncThunk(
  "applications/fetchAll",
  async (projectId: string, { getState, rejectWithValue }) => {
    try {
      const { filters } = (getState() as { applications: ApplicationsState })
        .applications;
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status && { status: filters.status }),
      });

      const response = await api.fetch<{
        applications: Application[];
        total: number;
      }>(`/api/projects/${projectId}/applications?${queryParams}`, {
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch applications");
    }
  }
);

// Update Application Status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async (
    {
      projectId,
      applicationId,
      status,
    }: {
      projectId: string;
      applicationId: string;
      status: ApplicationStatus;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.fetch<ApiResponse<Application>>(
        `/api/projects/${projectId}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
          requiresAuth: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update application status");
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<ApplicationsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset page to 1 when filters change
      if (Object.keys(action.payload).some((key) => key !== "page")) {
        state.filters.page = 1;
      }
    },
    setCurrentApplication: (state, action: PayloadAction<Application>) => {
      state.currentApplication = action.payload;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.totalApplications++;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.applications;
        state.totalApplications = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedApplication = action.payload;
        const index = state.items.findIndex(
          (app) => app.id === updatedApplication.id
        );
        if (index !== -1) {
          state.items[index] = updatedApplication;
        }
        if (state.currentApplication?.id === updatedApplication.id) {
          state.currentApplication = updatedApplication;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setCurrentApplication,
  clearCurrentApplication,
  resetFilters,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
