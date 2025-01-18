import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiCreateProfessor, ApiLogin } from '@/common/docs';
import { LoginDto } from '@/common/dto/auth/login.dto';

import { AuthService } from './auth.service';
import { CreateProfessorDto, ProfessorResponseDto } from '@/common/dto/professors';
import { ProfessorsService } from '../professors/professors.service';

// Handles authentication endpoints
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly professorsService: ProfessorsService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateProfessor()
  async register(@Body() createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    return await this.professorsService.create(createProfessorDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
