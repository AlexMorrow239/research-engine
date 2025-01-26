import {
  ACADEMIC_STANDING_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COLLEGE_OPTIONS,
  RACIAL_ETHNIC_OPTIONS,
} from "@/common/constants";
import { type RacialEthnicGroup } from "@/common/enums";
import { FormField } from "@/components/common/form-field/FormField";
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
    formState: { errors },
    setValue,
    watch,
  } = form;

  const [dragActive, setDragActive] = useState(false);
  const resumeFile = watch("studentInfo.resume");
  const selectedEthnicGroups = watch("studentInfo.racialEthnicGroups") || [];

  const handleFileChange = (file: File | null) => {
    if (file) {
      setValue("studentInfo.resume", file);
    }
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
              form={form}
              label="First Name"
              name="studentInfo.name.firstName"
              placeholder="Enter your first name"
            />
            <FormField
              form={form}
              label="Last Name"
              name="studentInfo.name.lastName"
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-field">
            <label className="form-field__label">
              C Number
              <span className="form-field__required">*</span>
            </label>
            <div className="form-field__c-number">
              <span className="form-field__c-number-prefix">C</span>
              <input
                className={`form-field__input ${
                  errors.studentInfo?.cNumber ? "form-field__input--error" : ""
                }`}
                {...form.register("studentInfo.cNumber")}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 8);
                  form.setValue("studentInfo.cNumber", `C${value}`);
                  console.log(value);
                }}
                placeholder="12345678"
                value={watch("studentInfo.cNumber")?.replace(/^C/, "") || ""}
              />
            </div>
            {errors.studentInfo?.cNumber && (
              <span className="form-field__error">
                {errors.studentInfo.cNumber.message}
              </span>
            )}
            <span className="form-field__help">
              Enter your University ID number
            </span>
          </div>
          <FormField
            form={form}
            label="Email"
            name="studentInfo.email"
            type="email"
            placeholder="your.email@miami.edu"
          />
          <FormField
            form={form}
            label="Phone Number"
            name="studentInfo.phoneNumber"
            placeholder="(305) 123-4567"
            type="tel"
          />
          <FormField
            form={form}
            label="Citizenship Status"
            name="studentInfo.citizenship"
            options={CITIZENSHIP_OPTIONS}
          />
        </div>
      </section>

      <section className="personal-info__section">
        <h4 className="personal-info__section-title">Academic Information</h4>
        <div className="personal-info__grid">
          <div className="personal-info__grid--paired">
            <FormField
              form={form}
              label="Academic Standing"
              name="studentInfo.academicStanding"
              options={ACADEMIC_STANDING_OPTIONS}
            />
            <FormField
              form={form}
              label="Expected Graduation Date"
              name="studentInfo.graduationDate"
              type="date"
              help="Select your expected graduation date"
              min={new Date().toISOString().split("T")[0]} // Today's date
            />
          </div>
          <div className="personal-info__grid--paired">
            <FormField
              form={form}
              label="College"
              name="studentInfo.major1College"
              options={COLLEGE_OPTIONS}
            />
            <FormField
              form={form}
              label="Major"
              name="studentInfo.major1"
              placeholder="Enter your major"
              help="Enter your primary field of study"
            />
          </div>
          <FormField
            form={form}
            label="GPA"
            name="studentInfo.gpa"
            type="number"
            placeholder="Enter your GPA (0-4.0)"
            help="Current cumulative GPA (e.g., 3.50)"
            min="0"
            max="4.0"
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
