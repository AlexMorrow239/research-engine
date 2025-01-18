import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banner } from "@/common/banner/Banner";
import "./NewProject.scss";

interface ProjectFormData {
  title: string;
  description: string;
  researchCategories: string[];
  requirements: string[];
  positions: number;
  applicationDeadline?: Date;
  status: "DRAFT" | "PUBLISHED";
}

const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  researchCategories: [],
  requirements: [],
  positions: 1,
  status: "DRAFT",
};

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    status: "DRAFT" | "PUBLISHED"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        status,
      };

      // TODO: Implement API call to save project
      console.log("Submitting project:", dataToSubmit);

      // On success, redirect to dashboard
      navigate("/faculty/dashboard");
    } catch (error) {
      console.error("Error saving project:", error);
      // TODO: Add error handling/notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const canSaveAsDraft = formData.title.trim() !== "";
  const canPublish =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.positions > 0;

  return (
    <div className="new-project">
      <Banner />

      <div className="new-project__container">
        <div className="new-project__header">
          <h1>Create New Research Project</h1>
          <p>Fill out the form below to create a new research opportunity</p>
        </div>

        <form
          className="new-project__form"
          onSubmit={(e) => handleSubmit(e, "PUBLISHED")}
        >
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter a descriptive title for your research project"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Describe your research project, its goals, and what students will be doing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="positions">Number of Positions *</label>
            <input
              type="number"
              id="positions"
              name="positions"
              value={formData.positions}
              onChange={handleInputChange}
              required
              min={1}
              max={10}
            />
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
                onClick={(e) => handleSubmit(e, "DRAFT")}
                disabled={isSubmitting || !canSaveAsDraft}
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSubmitting || !canPublish}
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
