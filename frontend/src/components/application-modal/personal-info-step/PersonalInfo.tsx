import {
  ACADEMIC_STANDING_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COLLEGE_OPTIONS,
  RACIAL_ETHNIC_OPTIONS,
} from "@/common/constants";
import { type ApplicationFormData } from "@/types";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import "./PersonalInfo.scss";

interface PersonalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ form }) => {
  const {
    register,
    formState: { errors, touchedFields },
    setValue,
  } = form;

  const [dragActive, setDragActive] = useState(false);
  const resumeFile = form.watch("studentInfo.resume");

  const handleFileChange = (file: File | null): void => {
    if (file && file.type === "application/pdf") {
      setValue("studentInfo.resume", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else if (file) {
      alert("Please upload a PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Add these handlers for drag and drop functionality
  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const getInputClassName = (baseClass = "form-group__input"): string => {
    return `${baseClass} ${errors.studentInfo ? "form-group__input--error" : ""} ${
      touchedFields.studentInfo ? "form-group__input--valid" : ""
    }`;
  };

  return (
    <div className="modal__step">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-group__label">
            First Name <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.name.firstName")}
            className={getInputClassName()}
            type="text"
            placeholder="Enter your first name"
          />
          {errors.studentInfo?.name?.firstName && (
            <span className="form-group__error">
              {errors.studentInfo.name.firstName.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Last Name <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.name.lastName")}
            className={getInputClassName()}
            type="text"
            placeholder="Enter your last name"
          />
          {errors.studentInfo?.name?.lastName && (
            <span className="form-group__error">
              {errors.studentInfo.name.lastName.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            C Number <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.cNumber")}
            className={getInputClassName()}
            placeholder="C12345678"
          />
          {errors.studentInfo?.cNumber && (
            <span className="form-group__error">
              {errors.studentInfo.cNumber.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Email <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.email")}
            className={getInputClassName()}
            type="email"
            placeholder="your.email@miami.edu"
          />
          {errors.studentInfo?.email && (
            <span className="form-group__error">
              {errors.studentInfo.email.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Phone Number <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.phoneNumber")}
            className={getInputClassName()}
            placeholder="305-123-4567"
          />
          {errors.studentInfo?.phoneNumber && (
            <span className="form-group__error">
              {errors.studentInfo.phoneNumber.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Citizenship Status <span className="required">*</span>
          </label>
          <select
            {...register("studentInfo.citizenship")}
            className={getInputClassName()}
          >
            <option value="">Select citizenship status</option>
            {CITIZENSHIP_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.studentInfo?.citizenship && (
            <span className="form-group__error">
              {errors.studentInfo.citizenship.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Academic Standing <span className="required">*</span>
          </label>
          <select
            {...register("studentInfo.academicStanding")}
            className={getInputClassName()}
          >
            <option value="">Select academic standing</option>
            {ACADEMIC_STANDING_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.studentInfo?.academicStanding && (
            <span className="form-group__error">
              {errors.studentInfo.academicStanding.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Expected Graduation Date <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.graduationDate")}
            className={getInputClassName()}
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.studentInfo?.graduationDate && (
            <span className="form-group__error">
              {errors.studentInfo.graduationDate.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            College <span className="required">*</span>
          </label>
          <select
            {...register("studentInfo.major1College")}
            className={getInputClassName()}
          >
            <option value="">Select college</option>
            {COLLEGE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.studentInfo?.major1College && (
            <span className="form-group__error">
              {errors.studentInfo.major1College.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Major <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.major1")}
            className={getInputClassName()}
            type="text"
            placeholder="Enter your major"
          />
          {errors.studentInfo?.major1 && (
            <span className="form-group__error">
              {errors.studentInfo.major1.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            GPA <span className="required">*</span>
          </label>
          <input
            {...register("studentInfo.gpa", { valueAsNumber: true })}
            className={getInputClassName()}
            type="number"
            step="0.01"
            min="0"
            max="4"
            placeholder="Enter your GPA (0-4.0)"
          />
          {errors.studentInfo?.gpa && (
            <span className="form-group__error">
              {errors.studentInfo.gpa.message}
            </span>
          )}
        </div>

        <div className="form-group form-group--full">
          <label className="form-group__label">
            Resume (PDF) <span className="required">*</span>
          </label>
          <div
            className={`resume-upload ${dragActive ? "drag-active" : ""} ${
              errors.studentInfo?.resume ? "resume-upload--error" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              className="resume-upload__input"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            <div className="resume-upload__content">
              <Upload className="resume-upload__icon" />
              {resumeFile ? (
                <p className="resume-upload__filename">{resumeFile.name}</p>
              ) : (
                <>
                  <p className="resume-upload__text">
                    Drag and drop your resume here or click to browse
                  </p>
                  <p className="resume-upload__hint">PDF only, max 5MB</p>
                </>
              )}
            </div>
          </div>
          {errors.studentInfo?.resume && (
            <span className="form-group__error">
              {errors.studentInfo.resume.message as string}
            </span>
          )}
        </div>

        <div className="form-group form-group--full">
          <label className="form-group__label">
            Racial/Ethnic Groups <span className="required">*</span>
          </label>
          <select
            {...register("studentInfo.racialEthnicGroups")}
            className={getInputClassName()}
            multiple
          >
            {RACIAL_ETHNIC_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.studentInfo?.racialEthnicGroups && (
            <span className="form-group__error">
              {errors.studentInfo.racialEthnicGroups.message}
            </span>
          )}
          <small className="form-group__help">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple options
          </small>
        </div>
      </div>
    </div>
  );
};
