import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Represents a file attached to a project.
 * Files can be documents like project descriptions, requirements, or other supporting materials.
 * This schema is embedded within the Project schema.
 */
@Schema({ timestamps: true })
export class ProjectFile {
  /** The system-generated filename used for storage */
  @Prop({ required: true })
  fileName: string;

  /** The original name of the file when it was uploaded */
  @Prop({ required: true })
  originalName: string;

  /** The MIME type of the file (e.g., 'application/pdf') */
  @Prop({ required: true })
  mimeType: string;

  /** The size of the file in bytes */
  @Prop({ required: true })
  size: number;

  /** Timestamp when the file was uploaded */
  @Prop({ required: true })
  uploadedAt: Date;
}

export const ProjectFileSchema = SchemaFactory.createForClass(ProjectFile);
