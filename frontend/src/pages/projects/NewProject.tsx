import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banner } from "@/common/banner/Banner";
import "./NewProject.scss";
import { createProject } from "@/store/features/projects/projectsSlice";
import { addToast } from "@/store/features/ui/uiSlice";
import { useAppDispatch } from "@/store";
import { ProjectStatus } from "@/common/enums";

// Zod schema for project creation
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
    .min(1, "At least one requirement is required")
    .refine((reqs) => reqs.every((req) => req.trim() !== ""), {
      message: "Requirements cannot be empty",
    }),
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

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [researchCategories, setResearchCategories] = useState([""]);
  const [requirements, setRequirements] = useState([""]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const onSubmit = async (
    data: ProjectFormData,
    status: "DRAFT" | "PUBLISHED"
  ) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        status: status as ProjectStatus,
        researchCategories: researchCategories.filter(
          (cat) => cat.trim() !== ""
        ),
        requirements: requirements.filter((req) => req.trim() !== ""),
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

      if (formattedData.requirements.length === 0) {
        dispatch(
          addToast({
            type: "error",
            message: "At least one requirement is required",
          })
        );
        return;
      }

      await dispatch(createProject(formattedData)).unwrap();

      dispatch(
        addToast({
          type: "success",
          message:
            status === ProjectStatus.DRAFT
              ? "Project saved as draft successfully!"
              : "Project published successfully!",
        })
      );

      navigate("/faculty/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      dispatch(
        addToast({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create project. Please try again.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-project">
      <Banner />

      <div className="new-project__container">
        <div className="new-project__header">
          <h1>Create New Research Project</h1>
          <p>Fill out the form below to create a new research opportunity</p>
        </div>

        <form className="new-project__form">
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
          </div>

          <div className="form-section">
            <h2 className="form-section__title">Additional Information</h2>

            <div className="form-group">
              <label>Research Categories</label>
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
                    className="btn btn--secondary"
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
                className="btn btn--secondary"
              >
                Add Category
              </button>
              {errors.researchCategories && (
                <span className="error-message">
                  {errors.researchCategories.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Requirements</label>
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
              className="btn btn--secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <div className="form-actions__right">
              <button
                type="button"
                className="btn btn--outline"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
