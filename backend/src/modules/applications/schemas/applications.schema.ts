import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApplicationStatus } from '@/common/enums';
import { Project } from '../../projects/schemas/projects.schema';
import { StudentInfo } from './student-info.schema';
import { AvailabilityInfo } from './availability-info.schema';
import { AdditionalInfo } from './additional-info.schema';

/**
 * Main application schema representing a student's project application.
 * Combines all related information schemas and tracks application status.
 *
 * Features:
 * - Project reference
 * - Comprehensive student information
 * - Application status tracking
 * - Resume storage
 * - Timestamp tracking
 *
 * Integration Points:
 * - Projects module for project reference
 * - AWS S3 for resume storage
 * - Analytics for application tracking
 */
@Schema({ timestamps: true })
export class Application extends Document {
  /**
   * Reference to the project being applied for.
   * Populated from Projects collection.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  /**
   * Comprehensive student information.
   * See StudentInfo schema for details.
   */
  @Prop({ type: StudentInfo, required: true })
  studentInfo: StudentInfo;

  /**
   * Student availability information.
   * See AvailabilityInfo schema for details.
   */
  @Prop({ type: AvailabilityInfo, required: true })
  availability: AvailabilityInfo;

  /**
   * Additional student qualifications.
   * See AdditionalInfo schema for details.
   */
  @Prop({ type: AdditionalInfo, required: true })
  additionalInfo: AdditionalInfo;

  /**
   * Path to stored resume in AWS S3.
   * Format: applications/{projectId}/cv/{timestamp}-{filename}
   */
  @Prop({ type: String })
  resumePath: string;

  /**
   * Current application status.
   * Managed through ApplicationStatus enum.
   */
  @Prop({
    type: String,
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  /**
   * Automatically managed timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
