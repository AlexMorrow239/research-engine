import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
class PublicationResponseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;
}
class NameResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class ProfessorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: NameResponseDto;

  @ApiProperty()
  department: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({ type: [String] })
  researchAreas?: string[];

  @ApiProperty()
  office: string;

  @ApiPropertyOptional({ type: [PublicationResponseDto] })
  publications?: PublicationResponseDto[];

  @ApiPropertyOptional({ maxLength: 100 })
  bio?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Hashed reset password token',
    required: false,
  })
  resetPasswordToken?: string;

  @ApiPropertyOptional({
    description: 'Reset password token expiration date',
    required: false,
  })
  resetPasswordExpires?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
