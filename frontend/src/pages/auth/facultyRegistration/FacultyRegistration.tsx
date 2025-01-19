import { useAppDispatch, useAppSelector } from "@/store";
import { registerFaculty } from "@/store/features/auth/authSlice";
import { addToast } from "@/store/features/ui/uiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./FacultyRegistration.scss";

type FormattedData = Omit<
  FacultyRegistrationForm,
  "confirmPassword" | "publications" | "firstName" | "lastName"
> & {
  name: {
    firstName: string;
    lastName: string;
  };
  publications?: Array<{ title: string; link: string }>;
};

// Define the form validation schema
const facultyRegistrationSchema = z
  .object({
    // Mandatory Fields
    email: z
      .string()
      .email("Invalid email address")
      .regex(
        /^[a-zA-Z0-9._-]+@miami\.edu$/,
        "Must be a valid Miami.edu email address"
      ),
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FacultyRegistrationForm>({
    resolver: zodResolver(facultyRegistrationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FacultyRegistrationForm): Promise<void> => {
    try {
      const { confirmPassword: _paswd, firstName, lastName, ...rest } = data;

      const formattedData: FormattedData = {
        ...rest,
        name: {
          firstName,
          lastName,
        },
        researchAreas: researchAreas.filter((area) => area.trim() !== ""),
        publications: publications
          .filter((pub) => pub.title.trim() !== "" && pub.link.trim() !== "")
          .map((pub) => ({
            title: pub.title.trim(),
            link: pub.link.trim(),
          })),
      };

      if (formattedData.researchAreas.length === 0) {
        dispatch(
          addToast({
            type: "error",
            message: "At least one research area is required",
          })
        );
        return;
      }

      if (formattedData.publications?.length === 0) {
        delete formattedData.publications;
      }
      await dispatch(registerFaculty(formattedData)).unwrap();

      dispatch(
        addToast({
          type: "success",
          message: "Registration successful! Welcome to the platform.",
        })
      );

      navigate("/faculty/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : error || "Registration failed. Please try again.";
      dispatch(
        addToast({
          type: "error",
          message: errorMessage,
        })
      );
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

            <div className="form-group">
              <label htmlFor="email">Miami Email Address</label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={errors.email ? "error" : ""}
                placeholder="username@miami.edu"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Admin Password</label>
              <input
                type="password"
                id="adminPassword"
                {...register("adminPassword")}
                className={errors.adminPassword ? "error" : ""}
              />
              {errors.adminPassword && (
                <span className="error-message">
                  {errors.adminPassword.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <span className="error-message">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                {...register("department")}
                className={errors.department ? "error" : ""}
              />
              {errors.department && (
                <span className="error-message">
                  {errors.department.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="office">Office Location</label>
              <input
                type="text"
                id="office"
                {...register("office")}
                placeholder="e.g., McArthur Engineering Building, Room 123"
              />
            </div>

            <div className="form-group">
              <label>Research Areas</label>
              {researchAreas.map((area, index) => (
                <div key={index} className="array-input">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      const newAreas = [...researchAreas];
                      newAreas[index] = e.target.value;
                      setResearchAreas(newAreas);
                    }}
                    placeholder="e.g., Machine Learning"
                  />
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                      const newAreas = [...researchAreas];
                      newAreas.splice(index, 1);
                      setResearchAreas(newAreas);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setResearchAreas([...researchAreas, ""])}
                className="button button--secondary"
              >
                Add Research Area
              </button>
              {errors.researchAreas && (
                <span className="error-message">
                  {errors.researchAreas.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section__title">Optional Information</h2>

            <div className="form-group">
              <label htmlFor="title">Academic Title</label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="e.g., Associate Professor"
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                {...register("bio")}
                className={errors.bio ? "error" : ""}
                placeholder="Tell us about your research interests and experience..."
                rows={4}
              />
              {errors.bio && (
                <span className="error-message">{errors.bio.message}</span>
              )}
            </div>
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
