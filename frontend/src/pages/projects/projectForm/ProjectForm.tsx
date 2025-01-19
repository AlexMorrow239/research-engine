import { ProjectStatus } from "@/common/enums";
import { useAppDispatch } from "@/store";
import {
  createProject,
  deleteProject,
  fetchProject,
  updateProject,
} from "@/store/features/projects/projectsSlice";
import { addToast } from "@/store/features/ui/uiSlice";
import type { Project } from "@/types/api";
import { ApiError } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import "./ProjectForm.scss";

// Zod schema for project creation/editing
const projectSchema = z.object({
  // Mandatory Fields
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  positions: z
    .number()
    .min(1, "Must have at least 1 position")
    .max(10, "Cannot exceed 10 positions"),
  applicationDeadline: z
    .date()
    .min(new Date(), "Application deadline must be in the future"),

  // Optional Fields
  researchCategories: z
    .array(z.string())
    .min(1, "At least one research category is required")
    .refine((cats) => cats.every((cat) => cat.trim() !== ""), {
      message: "Research categories cannot be empty",
    }),
  requirements: z
    .array(z.string())
    .optional()
    .default([])
    .transform((reqs) => reqs.filter((req) => req.trim() !== "")),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  researchCategories: [""],
  requirements: [""],
  positions: 1,
  applicationDeadline: new Date(),
  status: ProjectStatus.DRAFT,
};

interface ProjectFormProps {
  mode: "create" | "edit";
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [researchCategories, setResearchCategories] = useState([""]);
  const [requirements, setRequirements] = useState([""]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const currentStatus = watch("status");

  useEffect(() => {
    const loadProject = async (): Promise<void> => {
      if (mode === "edit" && projectId) {
        try {
          const response = await dispatch(fetchProject(projectId)).unwrap();

          // Check if we have a valid response
          if (!response) {
            throw new Error("No project data received");
          }

          const project = response as Project;

          const date = new Date(project.applicationDeadline);
          const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

          // Set form values
          setValue("title", project.title);
          setValue("description", project.description);
          setValue("positions", project.positions);
          setValue("applicationDeadline", date, {
            shouldDirty: true,
            shouldTouch: true,
          });

          // Set the formatted string value directly on the input element
          const dateInput = document.getElementById(
            "applicationDeadline"
          ) as HTMLInputElement;
          if (dateInput) {
            dateInput.value = formattedDate;
          }
          setValue("status", project.status);
          setValue("status", project.status);

          // Set array values with fallbacks
          const projectCategories =
            Array.isArray(project.researchCategories) &&
            project.researchCategories.length
              ? project.researchCategories
              : [""];
          setResearchCategories(projectCategories);
          setValue("researchCategories", projectCategories);

          const projectRequirements =
            Array.isArray(project.requirements) && project.requirements.length
              ? project.requirements
              : [""];
          setRequirements(projectRequirements);
          setValue("requirements", projectRequirements);
        } catch (error) {
          console.error("Error loading project:", error);
          dispatch(
            addToast({
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to load project details",
            })
          );
          // Only navigate if there's an authentication error
          if (error instanceof ApiError && error.status === 401) {
            navigate("/faculty/dashboard");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProject();
  }, [mode, projectId, dispatch, setValue, navigate]);

  const onSubmit = async (
    data: ProjectFormData,
    status: ProjectStatus,
    action?: "delete" | "delist"
  ): Promise<void> => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        status: status,
        applicationDeadline: new Date(data.applicationDeadline),
      };

      if (formattedData.researchCategories.length === 0) {
        dispatch(
          addToast({
            type: "error",
            message: "At least one research category is required",
          })
        );
        return;
      }

      if (action === "delete" && projectId) {
        await dispatch(deleteProject(projectId)).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Project deleted successfully!",
          })
        );
      } else if (mode === "edit" && projectId) {
        await dispatch(
          updateProject({ id: projectId, project: formattedData })
        ).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: getSuccessMessage(status, action),
          })
        );
      } else {
        await dispatch(createProject(formattedData)).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: `Project ${
              status === ProjectStatus.DRAFT ? "saved as draft" : "published"
            } successfully!`,
          })
        );
      }

      navigate("/faculty/dashboard");
    } catch (error) {
      console.error("Error handling project:", error);
      dispatch(
        addToast({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to handle project. Please try again.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSuccessMessage = (
    status: ProjectStatus,
    action?: "delete" | "delist"
  ): string => {
    if (action === "delist") return "Project delisted successfully!";
    switch (status) {
      case ProjectStatus.DRAFT:
        return "Project moved to drafts successfully!";
      case ProjectStatus.PUBLISHED:
        return "Project updated successfully!";
      case ProjectStatus.CLOSED:
        return "Project closed successfully!";
      default:
        return "Project updated successfully!";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="project-form">
        <div className="project-form__container">
          <div className="project-form__loading">
            <h2>Loading project details...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-form">
      <div className="project-form__container">
        <div className="project-form__header">
          <h1>
            {mode === "edit"
              ? "Edit Research Project"
              : "Create New Research Project"}
          </h1>
          <p>
            {mode === "edit"
              ? "Update your research opportunity details"
              : "Fill out the form below to create a new research opportunity"}
          </p>
        </div>

        <form className="project-form__form">
          <div className="form-section">
            <h2 className="form-section__title">Required Information</h2>

            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className={errors.title ? "error" : ""}
                placeholder="Enter a descriptive title for your research project"
              />
              {errors.title && (
                <span className="error-message">{errors.title.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                {...register("description")}
                className={errors.description ? "error" : ""}
                rows={6}
                placeholder="Describe your research project, its goals, and what students will be doing"
              />
              {errors.description && (
                <span className="error-message">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="positions">Number of Positions *</label>
              <input
                type="number"
                id="positions"
                {...register("positions", { valueAsNumber: true })}
                className={errors.positions ? "error" : ""}
                min={1}
                max={10}
              />
              {errors.positions && (
                <span className="error-message">
                  {errors.positions.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="applicationDeadline">
                Application Deadline *
              </label>
              <input
                type="date"
                id="applicationDeadline"
                {...register("applicationDeadline", {
                  setValueAs: (value) => (value ? new Date(value) : null),
                })}
                className={errors.applicationDeadline ? "error" : ""}
              />
              {errors.applicationDeadline && (
                <span className="error-message">
                  {errors.applicationDeadline.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Research Categories *</label>
              {researchCategories.map((category, index) => (
                <div key={index} className="array-input">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => {
                      const newCategories = [...researchCategories];
                      newCategories[index] = e.target.value;
                      setResearchCategories(newCategories);
                      setValue("researchCategories", newCategories);
                    }}
                    placeholder="e.g., Machine Learning"
                  />
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => {
                      const newCategories = [...researchCategories];
                      newCategories.splice(index, 1);
                      setResearchCategories(newCategories);
                      setValue("researchCategories", newCategories);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setResearchCategories([...researchCategories, ""]);
                }}
                className="btn btn--secondary btn--sm"
              >
                Add Category
              </button>
              {errors.researchCategories && (
                <span className="error-message">
                  {errors.researchCategories.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section__title">Additional Information</h2>

            <div className="form-group">
              <label>Requirements (Optional)</label>
              {requirements.map((requirement, index) => (
                <div key={index} className="array-input">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => {
                      const newRequirements = [...requirements];
                      newRequirements[index] = e.target.value;
                      setRequirements(newRequirements);
                      setValue("requirements", newRequirements);
                    }}
                    placeholder="e.g., Programming experience in Python"
                  />
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      const newRequirements = [...requirements];
                      newRequirements.splice(index, 1);
                      setRequirements(newRequirements);
                      setValue("requirements", newRequirements);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRequirements([...requirements, ""]);
                }}
                className="btn btn--secondary"
              >
                Add Requirement
              </button>
              {errors.requirements && (
                <span className="error-message">
                  {errors.requirements.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn--outline btn--md"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <div className="form-actions__right">
              {mode === "edit" && (
                <>
                  {/* CLOSED project actions */}
                  {currentStatus === ProjectStatus.CLOSED && (
                    <>
                      <button
                        type="button"
                        className="btn btn--danger btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.DRAFT)
                        )}
                        disabled={isSubmitting}
                      >
                        Move to Drafts
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.CLOSED, "delete")
                        )}
                        disabled={isSubmitting}
                      >
                        Delete Forever
                      </button>
                    </>
                  )}

                  {/* PUBLISHED project actions */}
                  {currentStatus === ProjectStatus.PUBLISHED && (
                    <>
                      <button
                        type="button"
                        className="btn btn--outline btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.PUBLISHED, "delist")
                        )}
                        disabled={isSubmitting}
                      >
                        Delist Project
                      </button>
                      <button
                        type="submit"
                        className="btn btn--primary btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.PUBLISHED)
                        )}
                        disabled={isSubmitting}
                      >
                        Update Project
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.CLOSED)
                        )}
                        disabled={isSubmitting}
                      >
                        Close Project
                      </button>
                    </>
                  )}

                  {/* DRAFT project actions */}
                  {currentStatus === ProjectStatus.DRAFT && (
                    <>
                      <button
                        type="button"
                        className="btn btn--danger btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.DRAFT, "delete")
                        )}
                        disabled={isSubmitting}
                      >
                        Delete Forever
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.DRAFT)
                        )}
                        disabled={isSubmitting}
                      >
                        Save as Draft
                      </button>
                      <button
                        type="submit"
                        className="btn btn--primary btn--md"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, ProjectStatus.PUBLISHED)
                        )}
                        disabled={isSubmitting}
                      >
                        Publish Project
                      </button>
                    </>
                  )}
                </>
              )}

              {/* CREATE mode actions */}
              {mode === "create" && (
                <>
                  <button
                    type="button"
                    className="btn btn--outline btn--md"
                    onClick={handleSubmit((data) =>
                      onSubmit(data, ProjectStatus.DRAFT)
                    )}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary btn--md"
                    onClick={handleSubmit((data) =>
                      onSubmit(data, ProjectStatus.PUBLISHED)
                    )}
                    disabled={isSubmitting}
                  >
                    Publish Project
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
