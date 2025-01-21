import { type ApplicationFormData } from "@/types";
import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
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
  } = form;

  const [languages, setLanguages] = useState<string[]>([""]);

  const getInputClassName = (baseClass = "form-group__input"): string => {
    return `${baseClass} ${errors.additionalInfo ? "form-group__input--error" : ""}`;
  };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value === "true";
      setValue(`additionalInfo.${name}`, newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Clear dependent fields when switching to "No"
      if (!newValue) {
        if (name === "hasPrevResearchExperience") {
          setValue("additionalInfo.prevResearchExperience", "");
        }
        if (name === "speaksOtherLanguages") {
          setLanguages([""]);
          setValue("additionalInfo.additionalLanguages", []);
        }
      }
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

  const hasPrevResearch = watch(
    "additionalInfo.hasPrevResearchExperience"
  ) as boolean;
  const speaksOtherLangs = watch(
    "additionalInfo.speaksOtherLanguages"
  ) as boolean;

  return (
    <div className="modal__step">
      <h3>Additional Information</h3>
      <div className="form-grid">
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
              {...register("additionalInfo.prevResearchExperience", {
                required: "Please describe your previous research experience",
              })}
              className={getInputClassName()}
              placeholder="Enter your previous research experience"
            />
            {errors.additionalInfo?.prevResearchExperience && (
              <span className="form-group__error">
                {errors.additionalInfo.prevResearchExperience.message}
              </span>
            )}
          </div>
        )}

        <div className="form-group form-group--full">
          <label className="form-group__label">
            What are your research interests?{" "}
            <span className="required">*</span>
          </label>
          <textarea
            {...register("additionalInfo.researchInterestDescription", {
              required: "Please provide a detailed description",
            })}
            className={getInputClassName()}
            placeholder="Enter your research interests"
          />
          {errors.additionalInfo?.researchInterestDescription && (
            <span className="form-group__error">
              {errors.additionalInfo.researchInterestDescription.message}
            </span>
          )}
        </div>

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

        <RadioGroup
          name="speaksOtherLanguages"
          label="Do you speak any additional languages?"
          required
        />

        {speaksOtherLangs && (
          <div className="form-group form-group--full">
            <label className="form-group__label">
              Please list the languages you speak{" "}
              <span className="required">*</span>
            </label>
            {languages.map((language, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => {
                    const newLanguages = [...languages];
                    newLanguages[index] = e.target.value;
                    setLanguages(newLanguages);
                    setValue(
                      "additionalInfo.additionalLanguages",
                      newLanguages.filter((lang) => lang.trim() !== "")
                    );
                  }}
                  className={getInputClassName()}
                  placeholder="e.g., Spanish"
                />
                {languages.length > 1 && (
                  <button
                    type="button"
                    className="button button--secondary button--sm"
                    onClick={() => {
                      const newLanguages = [...languages];
                      newLanguages.splice(index, 1);
                      setLanguages(newLanguages);
                      setValue(
                        "additionalInfo.additionalLanguages",
                        newLanguages.filter((lang) => lang.trim() !== "")
                      );
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLanguages([...languages, ""])}
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
  );
};
