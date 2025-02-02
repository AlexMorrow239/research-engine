import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { registerFaculty } from "@/store/features/auth/authSlice";

import { ArrayField } from "@/components/common/array-field/ArrayField";
import { FormField } from "@/components/common/form-field/FormField";
import { PasswordField } from "@/components/common/password-field/PasswordField";
import { SearchableDropdown } from "@/components/common/searchable-dropdown/SearchableDropdown";

import { Department } from "@/common/enums";

import { useAppDispatch, useAppSelector } from "@/store";

import "./FacultyRegistration.scss";

interface FormattedData {
  email: string;
  password: string;
  adminPassword: string;
  department: string;
  office: string;
  name: {
    firstName: string;
    lastName: string;
  };
  title?: string;
  researchAreas: string[];
  publications?: {
    title: string;
    link: string;
  }[];
  bio?: string;
}

// Define the form validation schema
const facultyRegistrationSchema = z
  .object({
    // Mandatory Fields
    email: z
      .string()
      .email("Invalid email address")
      .regex(/.+@.*miami\.edu$/i, "Must be a valid Miami.edu email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    adminPassword: z.string().min(1, "Admin password is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    department: z.string().min(1, "Department is required"),
    office: z.string().min(1, "Office Location is required"),
    researchAreas: z
      .array(z.string())
      .min(1, "At least one research area is required")
      .refine((areas) => areas.every((area) => area.trim() !== ""), {
        message: "Research areas cannot be empty",
      }),

    // Optional Fields
    title: z.string().optional(),
    publications: z
      .array(
        z.object({
          title: z.string().optional().or(z.literal("")),
          link: z
            .string()
            .url("Must be a valid URL")
            .optional()
            .or(z.literal("")),
        })
      )
      .optional()
      .default([]),
    bio: z.string().max(1000, "Bio must not exceed 1000 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FacultyRegistrationForm = z.infer<typeof facultyRegistrationSchema>;

export default function FacultyRegistration(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [publications, setPublications] = useState([{ title: "", link: "" }]);
  const [researchAreas, setResearchAreas] = useState([""]);

  const form = useForm<FacultyRegistrationForm>({
    resolver: zodResolver(facultyRegistrationSchema),
    mode: "onChange",
  });

  const { setValue, handleSubmit, register } = form;

  const onSubmit = async (data: FacultyRegistrationForm): Promise<void> => {
    try {
      const { confirmPassword: _paswd, firstName, lastName, ...rest } = data;

      // Simplify the data structure to match what registerFaculty expects
      const formattedData: FormattedData = {
        email: rest.email,
        password: rest.password,
        adminPassword: rest.adminPassword,
        department: rest.department,
        office: rest.office,
        name: {
          firstName,
          lastName,
        },
        title: rest.title,
        researchAreas: researchAreas.filter((area) => area.trim() !== ""),
        publications: publications
          .filter((pub) => pub.title.trim() !== "" && pub.link.trim() !== "")
          .map((pub) => ({
            title: pub.title.trim(),
            link: pub.link.trim(),
          })),
        bio: rest.bio,
      };

      // Remove empty publications array
      if (formattedData.publications?.length === 0) {
        delete formattedData.publications;
      }

      // Attempt registration
      const result = await dispatch(registerFaculty(formattedData)).unwrap();

      if (result) {
        navigate("/faculty/dashboard");
      }
    } catch (err) {
      // Just log the error - the auth slice will handle the error toast
      console.error("Registration error:", err);
    }
  };

  const formSubmitHandler = handleSubmit(onSubmit);

  useEffect(() => {
    setValue(
      "researchAreas",
      researchAreas.filter((area) => area.trim() !== "")
    );
  }, [researchAreas, setValue]);

  return (
    <div className="faculty-registration">
      <div className="faculty-registration__container">
        <h1 className="faculty-registration__title">Faculty Registration</h1>
        {error && <p className="error-message">{error}</p>}
        <p className="faculty-registration__subtitle">
          Create your account to start posting research opportunities
        </p>

        <form
          className="faculty-registration__form"
          onSubmit={formSubmitHandler}
          noValidate
        >
          <div className="form-section">
            <h2 className="form-section__title">Required Information</h2>

            <FormField
              formType="generic"
              form={form}
              name="email"
              label="Miami Email Address"
              type="email"
              placeholder="username@miami.edu"
            />

            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            <PasswordField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />

            <PasswordField
              form={form}
              name="adminPassword"
              label="Admin Password"
              placeholder="Enter admin password"
            />

            <FormField
              formType="generic"
              form={form}
              name="firstName"
              label="First Name"
            />

            <FormField
              formType="generic"
              form={form}
              name="lastName"
              label="Last Name"
            />

            <SearchableDropdown
              form={form}
              name="department"
              label="Department"
              options={Object.values(Department)}
              placeholder="Search for department..."
            />
            <FormField
              formType="generic"
              form={form}
              name="office"
              label="Office Location"
              placeholder="e.g., McArthur Engineering Building, Room 123"
            />

            <ArrayField
              formType="generic"
              form={form}
              name="researchAreas"
              label="Research Areas"
              value={researchAreas}
              setValue={setResearchAreas}
              placeholder="e.g., Machine Learning"
              minItems={1}
            />
          </div>

          <div className="form-section">
            <h2 className="form-section__title">Optional Information</h2>

            <FormField
              formType="generic"
              form={form}
              name="title"
              label="Academic Title"
              required={false}
              placeholder="e.g., Associate Professor"
            />

            <div className="form-group">
              <label>Publications (Optional)</label>
              {publications.map((_, index) => (
                <div key={index} className="publication-input">
                  <input
                    type="text"
                    {...register(`publications.${index}.title`)}
                    placeholder="Publication Title (Optional)"
                  />
                  <input
                    type="url"
                    {...register(`publications.${index}.link`)}
                    placeholder="Publication URL (Optional)"
                  />
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      const newPublications = [...publications];
                      newPublications.splice(index, 1);
                      setPublications(newPublications);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPublications([...publications, { title: "", link: "" }])
                }
                className="button button--secondary"
              >
                Add Publication
              </button>
            </div>

            <FormField
              formType="generic"
              form={form}
              name="bio"
              label="Bio"
              type="textarea"
              required={false}
              placeholder="Tell us about your research interests and experience..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="button button--primary button--full-width"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
