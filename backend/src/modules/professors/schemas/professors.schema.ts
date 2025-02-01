import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents an academic publication associated with a professor.
 * Used as a nested schema within the Professor document.
 */
export class Publication {
  /**
   * Title of the academic publication.
   * Should be the full, official title as it appears in the publication.
   */
  @Prop({ required: true })
  title: string;

  /**
   * URL or DOI link to access the publication.
   * Should be a permanent link where possible.
   */
  @Prop({ required: true })
  link: string;
}

/**
 * Professor schema representing academic faculty members.
 *
 * Key features:
 * - Email-based authentication using university email
 * - Academic profile information
 * - Research and publication tracking
 * - Account status management
 * - Password reset functionality
 *
 * Security considerations:
 * - Passwords are hashed before storage
 * - Email must be from miami.edu domain
 * - Reset tokens have expiration dates
 */
@Schema({ timestamps: true })
export class Professor extends Document {
  /**
   * Professor's university email address.
   * Must be from the miami.edu domain.
   * Used as the unique identifier for authentication.
   */
  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@miami\.edu$/,
  })
  email: string;

  /**
   * Hashed password for authentication.
   * Never stored in plain text.
   * Hashing is handled by the service layer.
   */
  @Prop({ required: true })
  password: string;

  /**
   * Professor's full name.
   * Stored in separate firstName and lastName fields
   * for proper sorting and display.
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
   * Academic department affiliation.
   * Should match official university department names.
   */
  @Prop({ required: true })
  department: string;

  /**
   * Academic title/position.
   * Optional as it may change or not be immediately available.
   * Examples: "Associate Professor", "Assistant Professor", etc.
   */
  @Prop()
  title?: string;

  /**
   * Research areas or specialties.
   * Array of strings representing research interests.
   * Used for project matching and faculty search.
   */
  @Prop({ type: [String], required: true })
  researchAreas: string[];

  /**
   * Office location on campus.
   * Should follow university building/room number format.
   */
  @Prop({ required: true })
  office: string;

  /**
   * List of academic publications.
   * Optional array of Publication objects.
   * Empty array by default if not provided.
   */
  @Prop({ type: [Publication], default: [] })
  publications?: Publication[];

  /**
   * Professional biography or research summary.
   * Optional text limited to 1000 characters.
   */
  @Prop({ maxlength: 1000 })
  bio?: string;

  /**
   * Account status flag.
   * True: Account is active and can be used
   * False: Account is deactivated and cannot be used
   */
  @Prop({ default: true })
  isActive: boolean;

  /**
   * Token for password reset functionality.
   * Only present when a reset is in progress.
   * Cleared after successful reset.
   */
  @Prop()
  resetPasswordToken?: string;

  /**
   * Expiration timestamp for password reset token.
   * Ensures reset links cannot be used indefinitely.
   */
  @Prop()
  resetPasswordExpires?: Date;

  /**
   * Automatically managed timestamps.
   * Added by the timestamps: true schema option.
   */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generated Mongoose schema for the Professor class.
 * Includes all properties and their validation rules.
 * Automatically adds createdAt and updatedAt fields.
 */
export const ProfessorSchema = SchemaFactory.createForClass(Professor);

/**
 * Note: This schema is used in conjunction with:
 * - ProfessorsService for business logic
 * - ProfessorsController for API endpoints
 * - AuthModule for authentication
 *
 * Related DTOs handle input/output data transformation
 * and validation for the API layer.
 */
