import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiForgotPassword, ApiLogin, ApiRegister, ApiResetPassword } from '@/common/docs';
import { ForgotPasswordDto } from '@/common/dto/auth/forgot-password.dto';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { LoginDto } from '@/common/dto/auth/login.dto';
import { ResetPasswordDto } from '@/common/dto/auth/reset-password.dto';
import { RegisterProfessorDto } from '@/common/dto/professors';
import { AuthService } from './auth.service';

/**
 * Controller handling all authentication-related HTTP endpoints.
 * Provides functionality for:
 * - Professor registration
 * - Login and authentication
 * - Password management (forgot/reset)
 *
 * Security Features:
 * - JWT-based authentication
 * - Token-based password reset
 * - Rate limiting on auth attempts (configured via middleware)
 * - Admin password required for registration
 *
 * Note: All endpoints are public but may have internal security checks
 * such as admin password validation or token verification.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //#region Account Creation and Authentication

  /**
   * Registers a new professor account in the system.
   * Requires admin password for authorization.
   *
   * @route POST /auth/register
   * @security None (public endpoint)
   * @param registerProfessorDto - Registration data including admin password
   * @returns LoginResponseDto containing JWT token and professor profile
   * @throws UnauthorizedException if admin password is invalid
   * @throws ConflictException if email already exists
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(@Body() registerProfessorDto: RegisterProfessorDto): Promise<LoginResponseDto> {
    return await this.authService.register(registerProfessorDto);
  }

  /**
   * Authenticates a professor using email and password.
   * Generates and returns JWT token for subsequent requests.
   *
   * @route POST /auth/login
   * @security None (public endpoint)
   * @param loginDto - Login credentials (email and password)
   * @returns LoginResponseDto containing JWT token and professor profile
   * @throws UnauthorizedException for invalid credentials or inactive account
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  //#endregion

  //#region Password Management

  /**
   * Initiates password reset process by sending reset email.
   * Uses security best practices to prevent email enumeration.
   *
   * Process:
   * 1. Validates email exists (silently fails if not)
   * 2. Generates time-limited reset token
   * 3. Sends reset instructions via email
   *
   * @route POST /auth/forgot-password
   * @security None (public endpoint)
   * @param forgotPasswordDto - Contains email address
   * @returns void - Always returns 200 to prevent email enumeration
   */
  @Post('forgot-password')
  @ApiForgotPassword()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Resets professor's password using reset token.
   * Token must be valid and not expired.
   *
   * @route POST /auth/reset-password
   * @security None (public endpoint)
   * @param resetPasswordDto - Contains reset token and new password
   * @returns void
   * @throws UnauthorizedException if token is invalid or expired
   * @throws BadRequestException if new password format is invalid
   */
  @Post('reset-password')
  @ApiResetPassword()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  //#endregion
}
