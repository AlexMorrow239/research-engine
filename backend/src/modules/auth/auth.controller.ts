import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiForgotPassword, ApiLogin, ApiRegister, ApiResetPassword } from '@/common/docs';
import { LoginDto } from '@/common/dto/auth/login.dto';
import { RegisterProfessorDto } from '@/common/dto/professors';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from '@/common/dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/common/dto/auth/reset-password.dto';

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

  /**
   * Request password reset email
   */
  @Post('forgot-password')
  @ApiForgotPassword()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Reset password using token
   */
  @Post('reset-password')
  @ApiResetPassword()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
