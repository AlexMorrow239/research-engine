import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

import { Project } from '../../projects/schemas/projects.schema';

import { ApplicationStatus, ProjectLength, WeeklyAvailability } from '@/common/enums';

@Schema()
export class StudentInfo {
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

  @Prop({ required: true })
  cNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: [String], required: true })
  racialEthnicGroups: string[];

  @Prop({ required: true })
  citizenship: string;

  @Prop({ required: true })
  academicStanding: string;

  @Prop({ required: true })
  graduationDate: Date;

  @Prop({ required: true })
  major1College: string;

  @Prop({ required: true })
  major1: string;

  @Prop({ required: true })
  hasAdditionalMajor: boolean;

  @Prop()
  major2College?: string;

  @Prop()
  major2?: string;

  @Prop({ required: true })
  isPreHealth: boolean;

  @Prop()
  preHealthTrack?: string;

  @Prop({ required: true, min: 0, max: 4.0 })
  gpa: number;
}

@Schema({ _id: false })
export class AvailabilityInfo {
  @Prop({ required: true, enum: WeeklyAvailability })
  weeklyHours: string;

  @Prop({ required: true, enum: ProjectLength })
  desiredProjectLength: string;

  @Prop({ required: true, type: String })
  mondayAvailability: string;

  @Prop({ required: true, type: String })
  tuesdayAvailability: string;

  @Prop({ required: true, type: String })
  wednesdayAvailability: string;

  @Prop({ required: true, type: String })
  thursdayAvailability: string;

  @Prop({ required: true, type: String })
  fridayAvailability: string;

  @Prop({ required: true, type: String })
  saturdayAvailability: string;

  @Prop({ required: true, type: String })
  sundayAvailability: string;
}

@Schema()
export class AdditionalInfo {
  @Prop({ required: true })
  hasPrevResearchExperience: boolean;

  @Prop()
  prevResearchExperience: string;

  @Prop({ required: true })
  researchInterestDescription: string;

  @Prop({ required: true })
  hasFederalWorkStudy: boolean;

  @Prop({ required: true })
  speaksOtherLanguages: boolean;

  @Prop()
  additionalLanguages?: string[];

  @Prop({ required: true })
  comfortableWithAnimals: boolean;
}

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ type: StudentInfo, required: true })
  studentInfo: StudentInfo;

  @Prop({ type: AvailabilityInfo, required: true })
  availability: AvailabilityInfo;

  @Prop({ type: AdditionalInfo, required: true })
  additionalInfo: AdditionalInfo;

  @Prop({ type: String })
  resumePath: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
