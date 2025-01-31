import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { ProjectLength, WeeklyAvailability } from "@common/enums";

export class AvailabilityDto {
  @IsEnum(WeeklyAvailability)
  @IsNotEmpty()
  weeklyHours: string;

  @IsEnum(ProjectLength)
  @IsNotEmpty()
  desiredProjectLength: string;

  @IsString()
  @IsNotEmpty()
  mondayAvailability: string;

  @IsString()
  @IsNotEmpty()
  tuesdayAvailability: string;

  @IsString()
  @IsNotEmpty()
  wednesdayAvailability: string;

  @IsString()
  @IsNotEmpty()
  thursdayAvailability: string;

  @IsString()
  @IsNotEmpty()
  fridayAvailability: string;
  @IsString()
  @IsNotEmpty()
  saturdayAvailability: string;

  @IsString()
  @IsNotEmpty()
  sundayAvailability: string;
}
