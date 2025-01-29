import { Department } from "@/common/enums";
import { ArrayField } from "@/components/common/array-field/ArrayField";
import { FormField } from "@/components/common/form-field/FormField";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProfessor,
  updateProfessor,
} from "@/store/features/professors/professorsSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { professor, isLoading, error } = useAppSelector(
    (state) => state.professors
  );
  const [researchAreas, setResearchAreas] = useState<string[]>([""]);
  const [publications, setPublications] = useState<
    { title: string; link: string }[]
  >([{ title: "", link: "" }]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const form = useForm<FacultyAccountForm>({
    resolver: zodResolver(facultyAccountSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

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

      // If code gets here, the update was successful
      navigate("/faculty/dashboard");
    } catch (error) {
      // On error, stay on the current page (no navigation)
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

            <FormField
              formType="generic"
              form={form}
              name="email"
              label="Miami Email Address"
              type="email"
              disabled
            />

            <FormField
              formType="generic"
              form={form}
              name="firstName"
              label="First Name"
              required
            />

            <FormField
              formType="generic"
              form={form}
              name="lastName"
              label="Last Name"
              required
            />

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

            <FormField
              formType="generic"
              form={form}
              name="office"
              label="Office Location"
              required
              placeholder="e.g., McArthur Engineering Building, Room 123"
            />

            <ArrayField
              form={form}
              name="researchAreas"
              label="Research Areas"
              value={researchAreas}
              setValue={setResearchAreas}
              placeholder="e.g., Machine Learning"
              minItems={1}
              defaultValue={professor?.researchAreas || [""]}
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
              rows={4}
              placeholder="Tell us about your research interests and experience..."
            />
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
