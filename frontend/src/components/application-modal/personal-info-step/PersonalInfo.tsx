import { type ApplicationFormData } from "@/types";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import "./PersonalInfo.scss";

interface PersonalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

const RACIAL_ETHNIC_OPTIONS = [
  "AMERICAN_INDIAN",
  "ASIAN",
  "BLACK",
  "HISPANIC",
  "PACIFIC_ISLANDER",
  "WHITE",
  "OTHER",
];

const COLLEGE_OPTIONS = [
  { value: "ARTS_AND_SCIENCES", label: "College of Arts and Sciences" },
  { value: "ENGINEERING", label: "College of Engineering" },
  { value: "BUSINESS", label: "Miami Herbert Business School" },
  { value: "COMMUNICATION", label: "School of Communication" },
  { value: "EDUCATION", label: "School of Education" },
  { value: "NURSING", label: "School of Nursing" },
  { value: "ARCHITECTURE", label: "School of Architecture" },
  { value: "MUSIC", label: "Frost School of Music" },
];

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ form }) => {
  const {
    register,
    formState: { errors, touchedFields },
  } = form;

  const getInputClassName = (baseClass = "form-group__input") => {
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
            {...register("studentInfo.name.firstName", {
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            })}
            className={getInputClassName("name.firstName")}
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
            {...register("studentInfo.name.lastName", {
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            })}
            className={getInputClassName("name.lastName")}
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
            {...register("studentInfo.cNumber", {
              required: "C Number is required",
              pattern: {
                value: /^C[0-9]{8}$/,
                message: "Must be in format C12345678",
              },
            })}
            className={getInputClassName("cNumber")}
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
            {...register("studentInfo.email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@miami\.edu$/i,
                message: "Must be a valid miami.edu email",
              },
            })}
            className={getInputClassName("email")}
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
            {...register("studentInfo.phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[\d\-+() ]+$/,
                message: "Please enter a valid phone number",
              },
            })}
            className={getInputClassName("phoneNumber")}
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
            {...register("studentInfo.citizenship", {
              required: "Please select your citizenship status",
            })}
            className={getInputClassName("citizenship")}
          >
            <option value="">Select citizenship status</option>
            <option value="US_CITIZEN">U.S. Citizen</option>
            <option value="PERMANENT_RESIDENT">Permanent Resident</option>
            <option value="INTERNATIONAL">International Student</option>
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
            {...register("studentInfo.academicStanding", {
              required: "Please select your academic standing",
            })}
            className={getInputClassName("academicStanding")}
          >
            <option value="">Select academic standing</option>
            <option value="FRESHMAN">Freshman</option>
            <option value="SOPHOMORE">Sophomore</option>
            <option value="JUNIOR">Junior</option>
            <option value="SENIOR">Senior</option>
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
            {...register("studentInfo.graduationDate", {
              required: "Graduation date is required",
            })}
            className={getInputClassName("graduationDate")}
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
            {...register("studentInfo.major1College", {
              required: "Please select your college",
            })}
            className={getInputClassName("major1College")}
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
            {...register("studentInfo.major1", {
              required: "Major is required",
            })}
            className={getInputClassName("major1")}
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
            {...register("studentInfo.gpa", {
              required: "GPA is required",
              valueAsNumber: true,
              min: { value: 0, message: "GPA must be at least 0" },
              max: { value: 4, message: "GPA cannot exceed 4.0" },
            })}
            className={getInputClassName("gpa")}
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
            Racial/Ethnic Groups <span className="required">*</span>
          </label>
          <select
            {...register("studentInfo.racialEthnicGroups", {
              required: "Please select at least one option",
            })}
            className={getInputClassName("racialEthnicGroups")}
            multiple
          >
            {RACIAL_ETHNIC_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, " ")}
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
