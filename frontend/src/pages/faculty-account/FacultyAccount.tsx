import { Department } from "@/common/enums";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProfessor,
  updateProfessor,
} from "@/store/features/professors/professorsSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./FacultyAccount.scss";

const facultyAccountSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(/.+@.*miami\.edu$/i, "Must be a valid Miami.edu email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  department: z.nativeEnum(Department),
  title: z.string().optional(),
  office: z.string().min(1, "Office location is required"),
  researchAreas: z.array(z.string()),
  publications: z
    .array(
      z.object({
        title: z.string(),
        link: z.string().url("Must be a valid URL"),
      })
    )
    .optional(),
  bio: z.string().optional(),
});

type FacultyAccountForm = z.infer<typeof facultyAccountSchema>;

export const FacultyAccount = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { professor, isLoading, error } = useAppSelector(
    (state) => state.professors
  );
  const [researchAreas, setResearchAreas] = useState<string[]>([""]);
  const [publications, setPublications] = useState<
    { title: string; link: string }[]
  >([{ title: "", link: "" }]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FacultyAccountForm>({
    resolver: zodResolver(facultyAccountSchema),
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(fetchProfessor());
  }, [dispatch]);

  useEffect(() => {
    if (professor) {
      setValue("email", professor.email);
      setValue("firstName", professor.name.firstName);
      setValue("lastName", professor.name.lastName);
      setValue("department", professor.department as Department);
      setValue("title", professor.title || "");
      setValue("office", professor.office);
      setValue("researchAreas", professor.researchAreas || [""]);
      setValue(
        "publications",
        professor.publications || [{ title: "", link: "" }]
      );
      setValue("bio", professor.bio || "");
      setDepartmentSearch(professor.department);
      setResearchAreas(professor.researchAreas || [""]);
      setPublications(professor.publications || [{ title: "", link: "" }]);
    }
  }, [professor, setValue]);

  const onSubmit = async (data: FacultyAccountForm): Promise<void> => {
    try {
      const { email: _email, firstName, lastName, ...rest } = data;
      console.log("Submitting form:", data); // Add this for debugging

      await dispatch(
        updateProfessor({
          name: {
            firstName,
            lastName,
          },
          ...rest,
          researchAreas,
          publications,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  const filteredDepartments = Object.values(Department).filter((dept) =>
    dept.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const handleDepartmentSelect = (department: string): void => {
    setValue("department", department as Department);
    setDepartmentSearch(department);
    setShowDepartmentDropdown(false);
  };

  return (
    <div className="faculty-account">
      <div className="faculty-account__container">
        <h1 className="faculty-account__title">Edit Account</h1>
        {error && <p className="error-message">{error}</p>}

        <form
          className="faculty-account__form"
          onSubmit={handleSubmit(onSubmit)}
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
                disabled
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
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
              <div className="department-select">
                <input
                  type="text"
                  id="department"
                  value={departmentSearch}
                  onChange={(e) => {
                    setDepartmentSearch(e.target.value);
                    setShowDepartmentDropdown(true);
                  }}
                  onFocus={() => setShowDepartmentDropdown(true)}
                  placeholder="Search for department..."
                  className={errors.department ? "error" : ""}
                />
                {showDepartmentDropdown && (
                  <div className="department-dropdown">
                    {filteredDepartments.map((dept) => (
                      <div
                        key={dept}
                        className="department-option"
                        onClick={() => handleDepartmentSelect(dept)}
                      >
                        {dept}
                      </div>
                    ))}
                    {filteredDepartments.length === 0 && (
                      <div className="department-option no-results">
                        No departments found
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                className={errors.office ? "error" : ""}
              />
              {errors.office && (
                <span className="error-message">{errors.office.message}</span>
              )}
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
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};
