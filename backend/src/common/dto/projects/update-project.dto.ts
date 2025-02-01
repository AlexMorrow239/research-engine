import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Campus } from '@/common/enums';

import { ProjectStatus } from '@/common/enums';

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Campus,
    example: Campus.CORAL_GABLES,
    description: 'Campus where the research project is located',
    required: false,
  })
  @IsEnum(Campus, { message: 'Invalid campus selection' })
  @IsOptional()
  campus?: Campus;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  researchCategories?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  positions?: number;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  applicationDeadline?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  isVisible?: boolean;
}
