import { Prop, Schema } from '@nestjs/mongoose';

/**
 * Schema representing student personal and academic information.
 * Used within the Application schema to store applicant details.
 *
 * Features:
 * - Personal identification and contact info
 * - Academic status and performance
 * - Demographic information
 * - Pre-health tracking
 *
 * Note: All GPA values are validated to be between 0 and 4.0
 */
@Schema()
export class StudentInfo {
  /**
   * Student's full name, split into components.
   * Required for proper name display and sorting.
   */
  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    required: true,
  })
  name: {
    firstName: string;
    lastName: string;
  };

  /**
   * University assigned C-Number.
   * Format: C12345678
   */
  @Prop({ required: true })
  cNumber: string;

  /**
   * Student's university email address.
   * Used for application communications.
   */
  @Prop({ required: true })
  email: string;

  /**
   * Contact phone number.
   * Used for urgent communications.
   */
  @Prop({ required: true })
  phoneNumber: string;

  /**
   * Self-identified racial/ethnic groups.
   * Used for demographic tracking and reporting.
   */
  @Prop({ type: [String], required: true })
  racialEthnicGroups: string[];

  /**
   * Student's citizenship status.
   * Impacts eligibility for certain projects.
   */
  @Prop({ required: true })
  citizenship: string;

  /**
   * Current academic standing (e.g., Freshman, Sophomore).
   * Used for eligibility and reporting.
   */
  @Prop({ required: true })
  academicStanding: string;

  /**
   * Expected graduation date.
   * Used to determine project participation duration.
   */
  @Prop({ required: true })
  graduationDate: Date;

  /**
   * College of primary major.
   * Example: "College of Arts and Sciences"
   */
  @Prop({ required: true })
  major1College: string;

  /**
   * Primary major name.
   * Example: "Biology"
   */
  @Prop({ required: true })
  major1: string;

  /**
   * Indicates if student has a second major.
   * Controls validation of major2 fields.
   */
  @Prop({ required: true })
  hasAdditionalMajor: boolean;

  /**
   * College of secondary major.
   * Optional, required if hasAdditionalMajor is true.
   */
  @Prop()
  major2College?: string;

  /**
   * Secondary major name.
   * Optional, required if hasAdditionalMajor is true.
   */
  @Prop()
  major2?: string;

  /**
   * Indicates if student is on pre-health track.
   * Controls validation of preHealthTrack field.
   */
  @Prop({ required: true })
  isPreHealth: boolean;

  /**
   * Specific pre-health program.
   * Optional, required if isPreHealth is true.
   * Example: "Pre-Med", "Pre-Dental"
   */
  @Prop()
  preHealthTrack?: string;

  /**
   * Current cumulative GPA.
   * Validated to be between 0 and 4.0
   */
  @Prop({ required: true, min: 0, max: 4.0 })
  gpa: number;
}
