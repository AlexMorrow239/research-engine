import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProjectStatus } from "@/common/enums";
import { RootState } from "../../index";
import { api } from "@/utils/api";
import { ApiResponse } from "@/types/api";

interface Project {
  id: string;
  title: string;
  description: string;
  professor: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    department: string;
    email: string;
  };
  researchCategories: string[];
  requirements: string[];
  files: string[];
  status: ProjectStatus;
  positions: number;
  applicationDeadline: Date;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectsState {
  items: Project[];
  currentProject: Project | null;
  totalProjects: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    page: number;
    limit: number;
    department?: string;
    status?: ProjectStatus;
    search?: string;
    researchCategories?: string[];
    sortBy?: "createdAt" | "applicationDeadline";
    sortOrder?: "asc" | "desc";
  };
}

const initialState: ProjectsState = {
  items: [],
  currentProject: null,
  totalProjects: 0,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    status: ProjectStatus.PUBLISHED,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = (getState() as RootState).projects;
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.department && { department: filters.department }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.researchCategories && {
          researchCategories: filters.researchCategories.join(","),
        }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });

      // Updated to match backend route
      return await api.fetch<{ projects: Project[]; total: number }>(
        `/api/projects?${queryParams}`
      );
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchProfessorProjects = createAsyncThunk(
  "projects/fetchProfessorProjects",
  async ({ status }: { status?: ProjectStatus }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (status) {
        queryParams.append("status", status);
      }

      const url = `/api/projects/my-projects${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await api.fetch<Project[]>(url);

      return response;
    } catch (error) {
      console.error("Fetch Professor Projects Error:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (
    projectData: Omit<
      Project,
      "id" | "professor" | "files" | "isVisible" | "createdAt" | "updatedAt"
    >,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.fetch<ApiResponse<Project>>("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
        requiresAuth: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<ProjectsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset page to 1 when filters change
      if (Object.keys(action.payload).some((key) => key !== "page")) {
        state.filters.page = 1;
      }
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.projects;
        state.totalProjects = action.payload.total;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        if (!state.items) {
          state.items = [];
        }
        state.items.unshift(action.payload);
        state.totalProjects = (state.totalProjects || 0) + 1;
      })
      .addCase(fetchProfessorProjects.pending, (state: ProjectsState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfessorProjects.fulfilled,
        (state: ProjectsState, action: PayloadAction<Project[]>) => {
          state.isLoading = false;
          state.items = action.payload;
          state.totalProjects = action.payload.length;
        }
      )
      .addCase(
        fetchProfessorProjects.rejected,
        (state: ProjectsState, action: PayloadAction<unknown>) => {
          state.isLoading = false;
          state.error = action.payload as unknown as string;
        }
      );
  },
});

export const {
  setFilters,
  setCurrentProject,
  clearCurrentProject,
  resetFilters,
} = projectsSlice.actions;
export default projectsSlice.reducer;
