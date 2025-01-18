import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsArray,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { ProjectStatus } from '../../../modules/projects/schemas/projects.schema';
import { IsFutureDate } from '../../validators/date.validator';

const getDefaultDeadlineExample = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3); // Set to 3 months in the future
  return date.toISOString();
};
export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'Machine Learning Research Assistant',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Detailed project description...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Research categories',
    example: ['Machine Learning', 'Data Science'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  researchCategories: string[];

  @ApiProperty({
    description: 'Project requirements',
    example: ['Python programming', 'Statistics background'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  requirements: string[];

  @ApiProperty({
    description: 'Number of available positions',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  positions: number;

  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
    example: ProjectStatus.DRAFT,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({
    description: 'Application deadline',
    example: getDefaultDeadlineExample(),
  })
  @IsOptional()
  @IsDate()
  @IsFutureDate()
  applicationDeadline?: Date;
}
