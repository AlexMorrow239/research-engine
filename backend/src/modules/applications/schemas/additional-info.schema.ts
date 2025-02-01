import { Prop, Schema } from '@nestjs/mongoose';

/**
 * Schema representing additional student qualifications.
 * Tracks experience, interests, and special qualifications.
 *
 * Features:
 * - Research experience
 * - Work-study eligibility
 * - Language skills
 * - Special qualifications
 */
@Schema()
export class AdditionalInfo {
  /**
   * Indicates previous research experience.
   * Controls validation of prevResearchExperience field.
   */
  @Prop({ required: true })
  hasPrevResearchExperience: boolean;

  /**
   * Description of previous research experience.
   * Optional, required if hasPrevResearchExperience is true.
   */
  @Prop()
  prevResearchExperience: string;

  /**
   * Student's research interests and goals.
   * Used for project matching and evaluation.
   */
  @Prop({ required: true })
  researchInterestDescription: string;

  /**
   * Federal work-study eligibility status.
   * Impacts funding options for certain projects.
   */
  @Prop({ required: true })
  hasFederalWorkStudy: boolean;

  /**
   * Indicates proficiency in languages other than English.
   * Controls validation of additionalLanguages field.
   */
  @Prop({ required: true })
  speaksOtherLanguages: boolean;

  /**
   * List of additional languages spoken.
   * Optional, required if speaksOtherLanguages is true.
   */
  @Prop()
  additionalLanguages?: string[];

  /**
   * Indicates comfort working with research animals.
   * Required for certain lab positions.
   */
  @Prop({ required: true })
  comfortableWithAnimals: boolean;
}
