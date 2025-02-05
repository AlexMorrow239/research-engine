import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createProject,
  deleteProject,
  fetchProject,
  updateProject,
} from "@/store/features/projects/projectsSlice";

import { ArrayField } from "@/components/common/array-field/ArrayField";
import { FormField } from "@/components/common/form-field/FormField";
import { Loader } from "@/components/common/loader/Loader";

import { CAMPUS_OPTIONS } from "@/common/constants";
import { Campus, ProjectStatus } from "@/common/enums";

import { useAppDispatch } from "@/store";
import type { Project } from "@/types";
import { ApiError } from "@/utils/api";

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

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const { handleSubmit, setValue, watch } = form;

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
        "id" | "professor" | "files" | "createdAt" | "updatedAt"
      > = {
        ...data,
        status,
        applicationDeadline: new Date(data.applicationDeadline),
      };

      if (formattedData.researchCategories.length === 0) {
        return;
      }

      if (action === "delete" && projectId) {
        await dispatch(deleteProject(projectId)).unwrap();
      } else if (mode === "edit" && projectId) {
        await dispatch(
          updateProject({ id: projectId, project: formattedData })
        ).unwrap();
      } else {
        await dispatch(createProject(formattedData)).unwrap();
      }

      navigate("/faculty/dashboard");
    } catch (error) {
      console.error("Error handling project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="project-form project-form--loading">
        <Loader size={48} center message="Loading project details..." />
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

          <FormField
            formType="generic"
            form={form}
            name="title"
            label="Project Title"
            placeholder="Enter a descriptive title for your research project"
            defaultValue={mode === "edit" ? watch("title") : ""}
          />

          <FormField
            formType="generic"
            form={form}
            name="description"
            label="Project Description"
            type="textarea"
            placeholder="Describe your research project, its goals, and what students will be doing"
            defaultValue={mode === "edit" ? watch("description") : ""}
            rows={4}
          />

          <FormField
            formType="generic"
            form={form}
            type="select"
            label="Campus"
            name="campus"
            options={CAMPUS_OPTIONS}
            defaultValue={mode == "edit" ? watch("campus") : ""}
          />
        </section>

        <section className="form-section">
          <h2 className="form-section__title">Project Details</h2>

          <FormField
            formType="generic"
            form={form}
            name="positions"
            label="Number of Positions"
            type="number"
            min="1"
            max="10"
            defaultValue={
              mode === "edit" ? watch("positions")?.toString() : "1"
            }
          />

          <FormField
            formType="generic"
            form={form}
            name="applicationDeadline"
            label="Application Deadline"
            type="date"
            defaultValue={
              mode === "edit"
                ? watch("applicationDeadline")?.toISOString().split("T")[0]
                : ""
            }
          />

          <ArrayField
            formType="generic"
            form={form}
            name="researchCategories"
            label="Research Categories"
            value={researchCategories}
            setValue={setResearchCategories}
            placeholder="e.g., Machine Learning"
            minItems={1}
          />

          <ArrayField
            formType="generic"
            form={form}
            name="requirements"
            label="Requirements"
            value={requirements}
            setValue={setRequirements}
            placeholder="e.g., Programming experience in Python"
            required={false}
            help="Add any specific requirements for applicants"
            addButtonText="Add Requirement"
          />
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
