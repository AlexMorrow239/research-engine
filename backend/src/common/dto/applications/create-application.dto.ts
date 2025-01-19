import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';

import { AdditionalInfoDto } from '@/common/dto/applications/additional-info.dto';
import { AvailabilityDto } from '@/common/dto/applications/student-availability.dto';
import { StudentInfoDto } from '@/common/dto/applications/student-info.dto';

@ApiExtraModels(StudentInfoDto, AvailabilityDto, AdditionalInfoDto)
export class CreateApplicationDto {
  @ApiProperty({
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @ApiProperty({ type: StudentInfoDto })
  @ValidateNested()
  @Type(() => StudentInfoDto)
  @IsNotEmpty({ message: 'Student information is required' })
  studentInfo: StudentInfoDto;

  @ApiProperty({ type: AvailabilityDto })
  @ValidateNested()
  @Type(() => AvailabilityDto)
  @IsNotEmpty({ message: 'Availability information is required' })
  availability: AvailabilityDto;

  @ApiProperty({ type: AdditionalInfoDto })
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  @IsNotEmpty({ message: 'Additional information is required' })
  additionalInfo: AdditionalInfoDto;
}
