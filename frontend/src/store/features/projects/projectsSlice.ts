import { ProjectStatus } from "@/common/enums";
import type { ApiResponse, Project } from "@/types";
import { api, ApiError } from "@/utils/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../index";

interface ProjectsState {
  items: Project[];
  currentProject: Project | null;
  totalProjects: number;
  isLoading: boolean;
  isInitialLoad: boolean;
  error: string | null;
  availableResearchCategories: string[];
  filters: {
    page: number;
    limit: number;
    departments?: string[];
    campus?: string;
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
  isInitialLoad: true,
  error: null,
  availableResearchCategories: [],
  filters: {
    page: 1,
    limit: 10,
    status: ProjectStatus.PUBLISHED,
    sortBy: "createdAt",
    sortOrder: "desc",
    campus: undefined,
    researchCategories: [],
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
        ...(filters.departments?.length && {
          departments: filters.departments.join(","),
        }),
        ...(filters.campus &&
          filters.campus !== "" && { campus: filters.campus }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.researchCategories && {
          researchCategories: filters.researchCategories.join(","),
        }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });

      const response = await api.fetch<{
        projects: Project[];
        total: number;
      }>(`/api/projects?${queryParams}`, {
        requiresAuth: false,
      });

      // Validate response structure
      if (!response || !Array.isArray(response.projects)) {
        console.error("Invalid response structure:", response);
        return rejectWithValue("Invalid response format from server");
      }

      return response;
    } catch (error) {
      // Enhanced error handling
      console.error("Error fetching projects:", {
        error,
        type: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof ApiError) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          data: error.data,
        });
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        return rejectWithValue("Network error: Unable to connect to server");
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "An unknown error occurred while fetching projects"
      );
    }
  },
  {
    // Add condition to prevent duplicate requests
    condition: (_, { getState }) => {
      const { isLoading } = (getState() as RootState).projects;
      if (isLoading) {
        return false;
      }
      return true;
    },
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
      const response = await api.post<ApiResponse<Project>>(
        "/api/projects",
        projectData,
        { requiresAuth: true }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchProject = createAsyncThunk(
  "projects/fetchOne",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await api.fetch<ApiResponse<Project>>(
        `/api/projects/${projectId}`,
        {
          requiresAuth: false,
        }
      );
      // If the response is wrapped in a data property, return that
      return "data" in response ? response.data : response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (
    {
      id,
      project,
    }: {
      id: string;
      project: Omit<
        Project,
        "id" | "professor" | "files" | "isVisible" | "createdAt" | "updatedAt"
      >;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponse<Project>>(
        `/api/projects/${id}`,
        project,
        { requiresAuth: true }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId: string, { rejectWithValue }) => {
    try {
      await api.fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        requiresAuth: true,
      });
      return projectId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const delistProject = createAsyncThunk(
  "projects/delist",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch<ApiResponse<Project>>(
        `/api/projects/${projectId}/close`,
        {},
        { requiresAuth: true }
      );
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
      // Create a new object for filters to ensure proper state updates
      const newFilters = { ...state.filters };

      // Handle each filter type appropriately
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value === undefined) {
          // Remove the property if value is undefined
          delete newFilters[key as keyof ProjectsState["filters"]];
        } else if (key === "researchCategories" && Array.isArray(value)) {
          newFilters.researchCategories = [...value];
        } else {
          (newFilters[key as keyof ProjectsState["filters"]] as typeof value) =
            value;
        }
      });

      // Reset page to 1 when filters change (except for page updates)
      if (!action.payload.page) {
        newFilters.page = 1;
      }

      state.filters = newFilters;
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
        // Only show loading on initial load, not during filter updates
        if (state.items.length === 0) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.items = action.payload.projects;
        state.totalProjects = action.payload.total;

        // Extract unique research categories from all projects
        const categories = new Set<string>();
        action.payload.projects.forEach((project) => {
          project.researchCategories?.forEach((category) => {
            if (category) categories.add(category);
          });
        });
        state.availableResearchCategories = Array.from(categories).sort();
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
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
      )
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Find and update the project in items array
        const updatedProject = action.payload;
        if (!updatedProject) return;

        const projectId = updatedProject.id;
        const index = state.items.findIndex(
          (project) => project.id === projectId
        );
        if (index !== -1) {
          state.items[index] = updatedProject;
        }

        // Update currentProject if it matches
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.payload;
        if (!projectId) return;

        state.items = state.items.filter((project) => project.id !== projectId);
        state.totalProjects = state.totalProjects - 1;
        if (state.currentProject?.id === projectId) {
          state.currentProject = null;
        }

        state.isLoading = false;
        state.error = "";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(delistProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(delistProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        if (!updatedProject) return;

        const index = state.items.findIndex(
          (project) => project.id === updatedProject.id
        );
        if (index !== -1) {
          state.items[index] = updatedProject;
        }
        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }

        state.isLoading = false;
        state.error = "";
      })
      .addCase(delistProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setCurrentProject,
  clearCurrentProject,
  resetFilters,
} = projectsSlice.actions;
export default projectsSlice.reducer;
