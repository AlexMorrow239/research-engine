import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Campus } from '@/common/enums/campus.enum';
import { Professor } from '../../professors/schemas/professors.schema';
import { ProjectStatus } from '@/common/enums';
import { ProjectFile } from './project-file.schema';

/**
 * Represents a research project in the system.
 * Projects are created by professors and can be viewed and applied to by students.
 * Each project contains details about the research opportunity, requirements,
 * and application process.
 */
@Schema({ timestamps: true })
export class Project extends Document {
  /** The title of the research project */
  @Prop({ required: true })
  title: string;

  /** Detailed description of the project, its goals, and scope */
  @Prop({ required: true })
  description: string;

  /** Reference to the professor who created and manages this project */
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  })
  professor: Professor;

  /** The campus where this project will be conducted */
  @Prop({ required: true, type: String, enum: Campus })
  campus: Campus;

  /** Categories of research this project falls under */
  @Prop({ required: true, type: [String] })
  researchCategories: string[];

  /** Specific requirements or qualifications needed for the project */
  @Prop([String])
  requirements: string[];

  /**
   * Current status of the project
   * - DRAFT: Project is being prepared and not yet visible to students
   * - PUBLISHED: Project is active and accepting applications
   * - CLOSED: Project is no longer accepting applications
   */
  @Prop({
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
    required: true,
  })
  status: ProjectStatus;

  /** Number of student positions available for this project */
  @Prop({ required: true, min: 1 })
  positions: number;

  // FUTURE: Extra layer of filtering for later version.
  // /** Optional tags for additional categorization and filtering */
  // @Prop({ type: [String], default: [] })
  // tags?: string[];

  /** Deadline for students to submit applications */
  @Prop()
  applicationDeadline?: Date;

  /**
   * Controls whether the project is visible in search results
   * Projects can be hidden even when in PUBLISHED status
   */
  @Prop({ default: false })
  isVisible: boolean;

  /** Array of files attached to this project */
  @Prop({ type: [ProjectFile], default: [] })
  files: ProjectFile[];

  /** Timestamp when the project was created */
  createdAt: Date;

  /** Timestamp when the project was last updated */
  updatedAt: Date;
}

/**
 * Mongoose schema for the Project model.
 * Includes timestamps for tracking creation and updates.
 */
export const ProjectSchema = SchemaFactory.createForClass(Project);
