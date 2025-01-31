import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { ProjectStatus } from "@/common/enums";

import type { ApiResponse, Project, ProjectsState } from "@/types";
import { api, ApiError } from "@/utils/api";

import type { RootState } from "../../index";
import { addToast } from "../ui/uiSlice";

const initialState: ProjectsState = {
  allProjects: [],
  professorProjects: [],
  currentProject: null,
  totalProjects: 0,
  isLoading: false,
  isInitialLoad: true,
  error: null,
  availableResearchCategories: [],
  filters: {
    page: 1,
    limit: 10,
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

      const queryParams = new URLSearchParams();

      // Add basic params
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      // Only add search if it exists and isn't empty
      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      // Add other filters if they exist
      if (filters.departments?.length) {
        queryParams.append("departments", filters.departments.join(","));
      }

      if (filters.campus && filters.campus !== "") {
        queryParams.append("campus", filters.campus);
      }

      if (filters.researchCategories?.length) {
        queryParams.append(
          "researchCategories",
          filters.researchCategories.join(",")
        );
      }

      if (filters.sortBy) {
        queryParams.append("sortBy", filters.sortBy);
      }

      if (filters.sortOrder) {
        queryParams.append("sortOrder", filters.sortOrder);
      }

      const response = await api.fetch<{
        projects: Project[];
        total: number;
      }>(`/api/projects?${queryParams.toString()}`, {
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
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Let the error middleware handle auth errors
          return rejectWithValue(error);
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createProject = createAsyncThunk<
  Project,
  Omit<
    Project,
    "id" | "professor" | "files" | "isVisible" | "createdAt" | "updatedAt"
  >,
  { rejectValue: ApiError }
>("projects/create", async (projectData, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post<ApiResponse<Project>>(
      "/api/projects",
      projectData,
      { requiresAuth: true }
    );

    dispatch(
      addToast({
        type: "success",
        message: "Project created successfully!",
      })
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "Failed to create project. Please try again.",
        toastType: "error",
      })
    );
  }
});

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

export const updateProject = createAsyncThunk<
  Project,
  {
    id: string;
    project: Omit<
      Project,
      "id" | "professor" | "files" | "isVisible" | "createdAt" | "updatedAt"
    >;
  },
  { rejectValue: ApiError }
>("projects/update", async ({ id, project }, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.patch<ApiResponse<Project>>(
      `/api/projects/${id}`,
      project,
      { requiresAuth: true }
    );

    dispatch(
      addToast({
        type: "success",
        message: "Project updated successfully!",
      })
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "Failed to update project. Please try again.",
        toastType: "error",
      })
    );
  }
});

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>("projects/delete", async (projectId, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/api/projects/${projectId}`, { requiresAuth: true });

    dispatch(
      addToast({
        type: "success",
        message: "Project deleted successfully.",
      })
    );

    return projectId;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "Failed to delete project. Please try again.",
        toastType: "error",
      })
    );
  }
});

export const delistProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: ApiError }
>("projects/delist", async (projectId, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.patch<ApiResponse<Project>>(
      `/api/projects/${projectId}/close`,
      null,
      { requiresAuth: true }
    );

    dispatch(
      addToast({
        type: "success",
        message: "Project closed successfully.",
      })
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error);
    }
    return rejectWithValue(
      new ApiError({
        message: "Failed to close project. Please try again.",
        toastType: "error",
      })
    );
  }
});

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
        if (state.isInitialLoad) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.allProjects = action.payload.projects;
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
        if (!state.allProjects) {
          state.allProjects = [];
        }
        state.allProjects.unshift(action.payload);
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
          state.professorProjects = action.payload;
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
        // Find and update the project in allProjects array
        const updatedProject = action.payload;
        if (!updatedProject) return;

        const projectId = updatedProject.id;
        const index = state.allProjects.findIndex(
          (project) => project.id === projectId
        );
        if (index !== -1) {
          state.allProjects[index] = updatedProject;
        }

        // Update currentProject if it matches
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.payload;
        if (!projectId) return;

        state.allProjects = state.allProjects.filter(
          (project) => project.id !== projectId
        );
        state.totalProjects = state.totalProjects - 1;
        if (state.currentProject?.id === projectId) {
          state.currentProject = null;
        }

        state.isLoading = false;
        state.error = "";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(delistProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(delistProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        if (!updatedProject) return;

        // Update both allProjects and professorProjects arrays
        const updateProjectInArray = (projects: Project[]): void => {
          const index = projects.findIndex(
            (project) => project.id === updatedProject.id
          );
          if (index !== -1) {
            projects[index] = updatedProject;
          }
        };

        updateProjectInArray(state.allProjects);
        updateProjectInArray(state.professorProjects);

        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(delistProject.rejected, (state, action) => {
        console.error("Delisting project - rejected:", action.payload);
        state.isLoading = false;
        state.error = action.payload?.message || "An error occurred";
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
