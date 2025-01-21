import {
  ACADEMIC_STANDING_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COLLEGE_OPTIONS,
  RACIAL_ETHNIC_OPTIONS,
} from "@/common/constants";
import { type RacialEthnicGroup } from "@/common/enums";
import { type ApplicationFormData } from "@/types";
import { FileText, Upload, X } from "lucide-react";
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
    watch,
  } = form;

  const [dragActive, setDragActive] = useState(false);
  const resumeFile = watch("studentInfo.resume");
  const selectedEthnicGroups = watch("studentInfo.racialEthnicGroups") || [];

  type StudentInfoFields =
    | keyof ApplicationFormData["studentInfo"]
    | "name.firstName"
    | "name.lastName";

  const FormField = ({
    label,
    name,
    type = "text",
    required = true,
    placeholder,
    options,
    help,
  }: {
    label: string;
    name: StudentInfoFields;
    type?: string;
    required?: boolean;
    placeholder?: string;
    options?: readonly { readonly value: string; readonly label: string }[];
    help?: string;
  }) => {
    const error = errors.studentInfo?.[name as keyof typeof errors.studentInfo];
    const touched =
      touchedFields.studentInfo?.[
        name as keyof typeof touchedFields.studentInfo
      ];
    const inputClassName = `form-field__input ${
      error
        ? "form-field__input--error"
        : touched
          ? "form-field__input--success"
          : ""
    }`;

    return (
      <div className="form-field">
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
        {options ? (
          <select
            {...register(`studentInfo.${name}`)}
            className={inputClassName}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(`studentInfo.${name}`)}
            type={type}
            className={inputClassName}
            placeholder={placeholder}
          />
        )}
        {help && <span className="form-field__help">{help}</span>}
        {error && (
          <span className="form-field__error">
            {typeof error === "string"
              ? error
              : "message" in error
                ? error.message
                : "Invalid input"}
          </span>
        )}
      </div>
    );
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setValue("studentInfo.resume", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  return (
    <div className="personal-info">
      <section className="personal-info__section">
        <h4 className="personal-info__section-title">Basic Information</h4>
        <div className="personal-info__grid">
          <div className="personal-info__grid--paired">
            <FormField
              label="First Name"
              name="name.firstName"
              placeholder="Enter your first name"
            />
            <FormField
              label="Last Name"
              name="name.lastName"
              placeholder="Enter your last name"
            />
          </div>
          <FormField
            label="C Number"
            name="cNumber"
            placeholder="C12345678"
            help="Enter your University ID number"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="your.email@miami.edu"
          />
          <FormField
            label="Phone Number"
            name="phoneNumber"
            placeholder="(305) 123-4567"
          />
          <FormField
            label="Citizenship Status"
            name="citizenship"
            options={CITIZENSHIP_OPTIONS}
          />
        </div>
      </section>

      <section className="personal-info__section">
        <h4 className="personal-info__section-title">Academic Information</h4>
        <div className="personal-info__grid">
          <div className="personal-info__grid--paired">
            <FormField
              label="Academic Standing"
              name="academicStanding"
              options={ACADEMIC_STANDING_OPTIONS}
            />
            <FormField
              label="Expected Graduation Date"
              name="graduationDate"
              type="date"
            />
          </div>
          <div className="personal-info__grid--paired">
            <FormField
              label="College"
              name="major1College"
              options={COLLEGE_OPTIONS}
            />
            <FormField
              label="Major"
              name="major1"
              placeholder="Enter your major"
            />
          </div>
          <FormField
            label="GPA"
            name="gpa"
            type="text"
            placeholder="Enter your GPA (0-4.0)"
            help="Current cumulative GPA"
          />
          <div className="form-field">
            <label className="form-field__label">
              Racial/Ethnic Groups
              <span className="form-field__required">*</span>
            </label>
            <div className="ethnic-select">
              <select
                className={`form-field__input ${
                  errors.studentInfo?.racialEthnicGroups
                    ? "form-field__input--error"
                    : ""
                }`}
                value="" // Always reset to empty after selection
                onChange={(e) => {
                  const value = e.target.value as RacialEthnicGroup;
                  if (!value) return;

                  // Only add if not already selected
                  if (!selectedEthnicGroups.includes(value)) {
                    const newGroups = [...selectedEthnicGroups, value];
                    setValue("studentInfo.racialEthnicGroups", newGroups, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <option value="">Select racial/ethnic groups</option>
                {RACIAL_ETHNIC_OPTIONS.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                    disabled={selectedEthnicGroups.includes(value)}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {selectedEthnicGroups.length > 0 && (
                <div className="ethnic-select__tags">
                  {selectedEthnicGroups.map((group) => (
                    <span key={group} className="ethnic-select__tag">
                      {
                        RACIAL_ETHNIC_OPTIONS.find((opt) => opt.value === group)
                          ?.label
                      }
                      <button
                        type="button"
                        onClick={() => {
                          const newGroups = selectedEthnicGroups.filter(
                            (g) => g !== group
                          );
                          setValue(
                            "studentInfo.racialEthnicGroups",
                            newGroups,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.studentInfo?.racialEthnicGroups && (
                <span className="form-field__error">
                  {errors.studentInfo.racialEthnicGroups.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="personal-info__section">
        <h4 className="personal-info__section-title">Resume Upload</h4>
        <div
          className={`resume-upload ${dragActive ? "drag-active" : ""} ${
            errors.studentInfo?.resume ? "resume-upload--error" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => {
            // Prevent click from reaching the div when clicking the remove button
            if ((e.target as HTMLElement).closest(".resume-upload__remove")) {
              return;
            }
            // Trigger file input click
            (
              e.currentTarget.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement
            )?.click();
          }}
        >
          <input
            type="file"
            accept=".pdf"
            className="resume-upload__input"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          <div className="resume-upload__content">
            {resumeFile ? (
              <div className="resume-upload__preview">
                <FileText size={24} />
                <span className="resume-upload__filename">
                  {resumeFile.name}
                </span>
                <button
                  type="button"
                  className="resume-upload__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("studentInfo.resume", new File([], ""), {
                      shouldValidate: true,
                    });
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <>
                <Upload className="resume-upload__icon" />
                <p className="resume-upload__text">
                  Drag and drop your resume here or click to browse
                </p>
                <p className="resume-upload__hint">PDF only, max 5MB</p>
              </>
            )}
          </div>
          {errors.studentInfo?.resume && (
            <span className="form-field__error">
              {errors.studentInfo.resume.message as string}
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
