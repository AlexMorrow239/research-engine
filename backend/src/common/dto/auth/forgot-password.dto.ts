import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "professor.name@miami.edu",
    description: "University of Miami email address",
    format: "email",
    pattern: "^[a-zA-Z0-9._-]+@miami\\.edu$",
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+@miami\.edu$/, {
    message: "Email must be a valid miami.edu address",
  })
  email: string;
}
