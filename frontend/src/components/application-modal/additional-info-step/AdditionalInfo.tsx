import React, { useEffect, useState } from "react";

import type { UseFormReturn } from "react-hook-form";

import { ArrayField } from "@/components/common/array-field/ArrayField";
import { FormField } from "@/components/common/form-field/FormField";

import type { ApplicationFormData } from "@/types";

import "./AdditionalInfo.scss";

interface AdditionalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  form,
}) => {
  const {
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
            <FormField
              formType="application"
              form={form}
              name="additionalInfo.prevResearchExperience"
              label="Please describe your previous research experience"
              type="textarea"
              placeholder="Please provide details about your research experience, including the duration, topic, and your role"
              required
            />
          </div>
        )}

        {/* Research Interests Section */}
        <div className="form-group form-group--full">
          <FormField
            formType="application"
            form={form}
            name="additionalInfo.researchInterestDescription"
            label="What are your research interests?"
            type="textarea"
            placeholder="Describe your research interests, including specific areas or topics you'd like to explore"
            required
          />
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
            <div className="form-group form-group--full">
              <ArrayField
                formType="application"
                label="Please list the languages you speak"
                name="additionalInfo.additionalLanguages"
                form={form}
                value={languages}
                setValue={setLanguages}
                placeholder="e.g., Spanish, French, Mandarin"
                required
                minItems={1}
                addButtonText="Add Language"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
