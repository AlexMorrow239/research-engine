import { CAMPUS_OPTIONS } from "@/common/constants";
import { Campus, ProjectStatus } from "@/common/enums";
import { useAppDispatch } from "@/store";
import {
  createProject,
  deleteProject,
  fetchProject,
  updateProject,
} from "@/store/features/projects/projectsSlice";
import { addToast } from "@/store/features/ui/uiSlice";
import type { Project } from "@/types";
import { ApiError } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import "./ProjectForm.scss";

// Zod schema for project creation/editing
const projectSchema = z.object({
  title: z.string().min(1, "Please enter a project title"),
  description: z.string().min(1, "Please provide a project description"),
  positions: z.preprocess(
    (val) => (val === "" || isNaN(Number(val)) ? undefined : Number(val)),
    z
      .number({
        required_error: "Please enter the number of positions",
        invalid_type_error: "Please enter a valid number of positions",
      })
      .min(1, "Please specify at least 1 position")
  ),
  applicationDeadline: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z
      .date({
        required_error: "Please select an application deadline",
        invalid_type_error: "Please enter a valid date",
      })
      .min(
        new Date(),
        "Please select a future date for the application deadline"
      )
  ),
  researchCategories: z
    .array(z.string())
    .min(1, "Please add at least one research category")
    .refine((cats) => cats.every((cat) => cat.trim() !== ""), {
      message: "Research categories cannot be empty",
    }),
  campus: z.nativeEnum(Campus, {
    errorMap: () => ({ message: "Please select a campus location" }),
  }),

  // Optional Fields
  requirements: z
    .array(z.string())
    .optional()
    .default([])
    .transform((reqs) => reqs.filter((req) => req.trim() !== "")),
  status: z
    .nativeEnum(ProjectStatus, {
      errorMap: () => ({ message: "Please select a valid project status" }),
    })
    .default(ProjectStatus.DRAFT),
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
  campus: "" as Campus,
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
          setValue("campus", project.campus);

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
      const formattedData: Omit<
        Project,
        "id" | "professor" | "files" | "isVisible" | "createdAt" | "updatedAt"
      > = {
        ...data,
        status,
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

  if (isLoading) {
    return (
      <div className="project-form project-form--loading">
        <div className="loading-spinner" />
        <h2>Loading project details...</h2>
      </div>
    );
  }

  return (
    <div className="project-form">
      <header className="project-form__header">
        <div className="project-form__title">
          <h1>
            {mode === "edit"
              ? "Edit Research Project"
              : "Create New Research Project"}
          </h1>
          <p className="project-form__subtitle">
            {mode === "edit"
              ? "Update your research opportunity details below"
              : "Fill out the form below to create a new research opportunity"}
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data, currentStatus))}
        className="project-form__content"
      >
        <section className="form-section">
          <h2 className="form-section__title">Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title" className="form-group__label">
              <FileText className="form-group__icon" size={16} />
              Project Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className={`form-input ${errors.title ? "form-input--error" : ""}`}
              placeholder="Enter a descriptive title for your research project"
            />
            {errors.title && (
              <span className="form-group__error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-group__label">
              <Book className="form-group__icon" size={16} />
              Project Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className={`form-input form-input--textarea ${
                errors.description ? "form-input--error" : ""
              }`}
              placeholder="Describe your research project, its goals, and what students will be doing"
            />
            {errors.description && (
              <span className="form-group__error">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="campus" className="form-group__label">
              <MapPin className="form-group__icon" size={16} />
              Campus
            </label>
            <select
              id="campus"
              {...register("campus")}
              className={`form-input ${errors.campus ? "form-input--error" : ""}`}
            >
              <option value="">Select a campus</option>
              {CAMPUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.campus && (
              <span className="form-group__error">{errors.campus.message}</span>
            )}
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section__title">Project Details</h2>

          <div className="form-group">
            <label htmlFor="positions" className="form-group__label">
              <Users className="form-group__icon" size={16} />
              Number of Positions
            </label>
            <input
              type="number"
              id="positions"
              {...register("positions", { valueAsNumber: true })}
              className={`form-input ${errors.positions ? "form-input--error" : ""}`}
              min={1}
              max={10}
            />
            {errors.positions && (
              <span className="form-group__error">
                {errors.positions.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="applicationDeadline" className="form-group__label">
              <Calendar className="form-group__icon" size={16} />
              Application Deadline
            </label>
            <input
              type="date"
              id="applicationDeadline"
              {...register("applicationDeadline")}
              className={`form-input ${
                errors.applicationDeadline ? "form-input--error" : ""
              }`}
            />
            {errors.applicationDeadline && (
              <span className="form-group__error">
                {errors.applicationDeadline.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label">Research Categories</label>
            <div className="form-group__array">
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
                    className="form-input"
                    placeholder="e.g., Machine Learning"
                  />
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => {
                      const newCategories = [...researchCategories];
                      newCategories.splice(index, 1);
                      setResearchCategories(newCategories);
                      setValue("researchCategories", newCategories);
                    }}
                    disabled={researchCategories.length === 1}
                  >
                    <span className="btn__icon">×</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setResearchCategories([...researchCategories, ""])
                }
                className="btn btn--secondary btn--sm"
              >
                Add Category
              </button>
            </div>
            {errors.researchCategories && (
              <span className="form-group__error">
                {errors.researchCategories.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label">
              <Briefcase className="form-group__icon" size={16} />
              Requirements (Optional)
            </label>
            <div className="form-group__array">
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
                    className="form-input"
                    placeholder="e.g., Programming experience in Python"
                  />
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => {
                      const newRequirements = [...requirements];
                      newRequirements.splice(index, 1);
                      setRequirements(newRequirements);
                      setValue("requirements", newRequirements);
                    }}
                  >
                    <span className="btn__icon">×</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRequirements([...requirements, ""])}
                className="btn btn--secondary btn--sm"
              >
                Add Requirement
              </button>
            </div>
            {errors.requirements && (
              <span className="form-group__error">
                {errors.requirements.message}
              </span>
            )}
          </div>
        </section>

        <footer className="form-actions">
          <div className="form-actions__left">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>

          <div className="form-actions__right">
            {mode === "edit" ? (
              <>
                {currentStatus === ProjectStatus.CLOSED && (
                  <>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.DRAFT)
                      )}
                      disabled={isSubmitting}
                    >
                      Move to Drafts
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.CLOSED, "delete")
                      )}
                      disabled={isSubmitting}
                    >
                      Delete Forever
                    </button>
                  </>
                )}

                {currentStatus === ProjectStatus.PUBLISHED && (
                  <>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.PUBLISHED)
                      )}
                      disabled={isSubmitting}
                    >
                      Update Project
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.CLOSED)
                      )}
                      disabled={isSubmitting}
                    >
                      Close Project
                    </button>
                  </>
                )}

                {currentStatus === ProjectStatus.DRAFT && (
                  <>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.DRAFT, "delete")
                      )}
                      disabled={isSubmitting}
                    >
                      Delete Forever
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={handleSubmit((data) =>
                        onSubmit(data, ProjectStatus.DRAFT)
                      )}
                      disabled={isSubmitting}
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary"
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
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleSubmit((data) =>
                    onSubmit(data, ProjectStatus.DRAFT)
                  )}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
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
        </footer>
      </form>
    </div>
  );
};
