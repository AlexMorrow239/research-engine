import React, { useEffect, useState } from "react";

import type { UseFormReturn } from "react-hook-form";

import type { ApplicationFormData } from "@/types";

import "./AdditionalInfo.scss";

interface AdditionalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  form,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = form;

  const [languages, setLanguages] = useState<string[]>([""]);

  // Watch for relevant form fields
  const hasPrevResearch = watch(
    "additionalInfo.hasPrevResearchExperience"
  ) as boolean;
  const speaksOtherLangs = watch(
    "additionalInfo.speaksOtherLanguages"
  ) as boolean;
  const watchedLanguages = watch(
    "additionalInfo.additionalLanguages"
  ) as string[];

  // Sync languages state with form data when needed
  useEffect(() => {
    if (speaksOtherLangs && watchedLanguages?.length > 0) {
      setLanguages(watchedLanguages);
    }
  }, [speaksOtherLangs, watchedLanguages]);

  // Input classname helper with proper error handling
  const getInputClassName = (
    fieldName: string,
    baseClass = "form-group__input"
  ): string => {
    const fieldError =
      errors.additionalInfo?.[
        fieldName as keyof ApplicationFormData["additionalInfo"]
      ];
    return `${baseClass} ${fieldError ? "form-group__input--error" : ""}`;
  };

  // Radio group component with improved error handling
  const RadioGroup = ({
    name,
    label,
    required = false,
  }: {
    name: keyof ApplicationFormData["additionalInfo"];
    label: string;
    required?: boolean;
  }): JSX.Element => {
    const value = watch(`additionalInfo.${name}`) as boolean;

    const handleChange = async (
      e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
      const newValue = e.target.value === "true";
      setValue(`additionalInfo.${name}`, newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Clear dependent fields when switching to "No"
      if (!newValue) {
        if (name === "hasPrevResearchExperience") {
          setValue("additionalInfo.prevResearchExperience", "", {
            shouldValidate: true,
          });
        }
        if (name === "speaksOtherLanguages") {
          setLanguages([""]);
          setValue("additionalInfo.additionalLanguages", [], {
            shouldValidate: true,
          });
        }
      }

      // Trigger validation after state updates
      await trigger(`additionalInfo.${name}`);
    };

    return (
      <div className="form-group">
        <label className="form-group__label">
          {label} {required && <span className="required">*</span>}
        </label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`additionalInfo.${name}`}
              value="true"
              checked={value === true}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={`additionalInfo.${name}`}
              value="false"
              checked={value === false}
              onChange={handleChange}
            />
            No
          </label>
        </div>
        {errors.additionalInfo?.[name] && (
          <span className="form-group__error">
            {errors.additionalInfo[name]?.message}
          </span>
        )}
      </div>
    );
  };

  // Language input handlers
  const handleLanguageChange = async (
    index: number,
    value: string
  ): Promise<void> => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);

    // Filter out empty strings before setting the value
    const validLanguages = newLanguages.filter((lang) => lang.trim() !== "");
    setValue("additionalInfo.additionalLanguages", validLanguages, {
      shouldValidate: true,
      shouldDirty: true,
    });
    await trigger("additionalInfo.additionalLanguages");
  };

  const handleAddLanguage = (): void => {
    setLanguages([...languages, ""]);
  };

  const handleRemoveLanguage = async (index: number): Promise<void> => {
    const newLanguages = [...languages];
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);

    // Update form value and validate
    const validLanguages = newLanguages.filter((lang) => lang.trim() !== "");
    setValue("additionalInfo.additionalLanguages", validLanguages, {
      shouldValidate: true,
      shouldDirty: true,
    });
    await trigger("additionalInfo.additionalLanguages");
  };

  return (
    <div className="modal__step">
      <h3>Additional Information</h3>
      <div className="form-grid">
        {/* Research Experience Section */}
        <div className="form-group form-group--full">
          <RadioGroup
            name="hasPrevResearchExperience"
            label="Do you have previous research experience?"
            required
          />
        </div>

        {hasPrevResearch && (
          <div className="form-group form-group--full">
            <label className="form-group__label">
              Please describe your previous research experience{" "}
              <span className="required">*</span>
            </label>
            <textarea
              {...register("additionalInfo.prevResearchExperience")}
              className={getInputClassName("prevResearchExperience")}
              placeholder="Please provide details about your research experience, including the duration, topic, and your role"
            />
            {errors.additionalInfo?.prevResearchExperience && (
              <span className="form-group__error">
                {errors.additionalInfo.prevResearchExperience.message}
              </span>
            )}
          </div>
        )}

        {/* Research Interests Section */}
        <div className="form-group form-group--full">
          <label className="form-group__label">
            What are your research interests?{" "}
            <span className="required">*</span>
          </label>
          <textarea
            {...register("additionalInfo.researchInterestDescription")}
            className={getInputClassName("researchInterestDescription")}
            placeholder="Describe your research interests, including specific areas or topics you'd like to explore"
          />
          {errors.additionalInfo?.researchInterestDescription && (
            <span className="form-group__error">
              {errors.additionalInfo.researchInterestDescription.message}
            </span>
          )}
        </div>

        {/* Other Qualifications Section */}
        <RadioGroup
          name="hasFederalWorkStudy"
          label="Do you have Federal Work Study?"
          required
        />

        <RadioGroup
          name="comfortableWithAnimals"
          label="Are you comfortable working with animals?"
          required
        />

        {/* Languages Section */}
        <div className="form-group form-group--full">
          <RadioGroup
            name="speaksOtherLanguages"
            label="Do you speak any additional languages?"
            required
          />

          {speaksOtherLangs && (
            <div className="languages-container">
              <label className="form-group__label">
                Please list the languages you speak{" "}
                <span className="required">*</span>
              </label>
              {languages.map((language, index) => (
                <div key={index} className="array-input">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) =>
                      void handleLanguageChange(index, e.target.value)
                    }
                    className={getInputClassName("additionalLanguages")}
                    placeholder="e.g., Spanish, French, Mandarin"
                  />
                  {languages.length > 1 && (
                    <button
                      type="button"
                      className="button button--secondary button--sm"
                      onClick={() => void handleRemoveLanguage(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLanguage}
                className="button button--secondary button--sm"
              >
                Add Language
              </button>
              {errors.additionalInfo?.additionalLanguages && (
                <span className="form-group__error">
                  {errors.additionalInfo.additionalLanguages.message}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
