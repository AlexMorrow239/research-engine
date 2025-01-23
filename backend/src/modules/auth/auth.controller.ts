import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin, ApiRegister } from '@/common/docs';
import { LoginDto } from '@/common/dto/auth/login.dto';
import { RegisterProfessorDto } from '@/common/dto/professors';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { AuthService } from './auth.service';

/**
 * Controller handling professor authentication endpoints
 * Provides registration and login functionality
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new professor account
   * Returns access token and professor profile on success
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(@Body() registerProfessorDto: RegisterProfessorDto): Promise<LoginResponseDto> {
    return await this.authService.register(registerProfessorDto);
  }

  /**
   * Authenticate an existing professor
   * Returns access token and professor profile on success
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
