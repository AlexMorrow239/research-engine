import { Prop, Schema } from '@nestjs/mongoose';
import { WeeklyAvailability, ProjectLength } from '@/common/enums';

/**
 * Schema representing student availability information.
 * Tracks weekly schedule and project duration preferences.
 *
 * Features:
 * - Weekly hour commitment
 * - Project length preference
 * - Daily availability schedule
 * - Schedule validation
 */
@Schema({ _id: false })
export class AvailabilityInfo {
  /**
   * Weekly hours student can commit to project.
   * Uses predefined ranges from WeeklyAvailability enum.
   */
  @Prop({ required: true, enum: WeeklyAvailability })
  weeklyHours: string;

  /**
   * Preferred project duration.
   * Uses predefined options from ProjectLength enum.
   */
  @Prop({ required: true, enum: ProjectLength })
  desiredProjectLength: string;

  /**
   * Daily availability schedules.
   * Format: HH:MM-HH:MM,HH:MM-HH:MM for multiple blocks
   * Example: "09:00-12:00,14:00-17:00"
   */
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
