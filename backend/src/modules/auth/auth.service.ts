import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import {
  ProfessorResponseDto,
  RegisterProfessorDto,
} from '@/common/dto/professors';
import { CustomLogger } from '@/common/services/logger.service';
import { ErrorHandler } from '@/common/utils/error-handler.util';

import { EmailService } from '../email/email.service';
import { ProfessorsService } from '../professors/professors.service';
import { Professor } from '../professors/schemas/professors.schema';
import { InvalidAdminPasswordException } from './exceptions/password.exception';

/**
 * Service handling authentication and authorization operations.
 * Manages the complete authentication lifecycle including:
 * - User registration with admin approval
 * - Login and JWT token generation
 * - Password management (reset, forgot password)
 * - Admin password validation
 *
 * Security Features:
 * - Bcrypt password hashing
 * - JWT token-based authentication
 * - Time-limited password reset tokens
 * - Admin password validation for sensitive operations
 *
 * Integration Points:
 * - Works with ProfessorsService for user management
 * - Uses EmailService for password reset communications
 * - Leverages JWT for token generation and validation
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private readonly jwtService: JwtService,
    private readonly professorsService: ProfessorsService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly logger: CustomLogger
  ) {}

  //#region Account Registration and Login

  /**
   * Registers a new professor account with admin validation.
   * Requires admin password for registration to prevent unauthorized access.
   *
   * Process:
   * 1. Validates admin password
   * 2. Creates professor account
   * 3. Generates login credentials
   *
   * @param registerProfessorDto - Registration data including admin password
   * @returns LoginResponseDto containing access token and professor info
   * @throws UnauthorizedException if admin password is invalid
   */
  async register(
    registerProfessorDto: RegisterProfessorDto
  ): Promise<LoginResponseDto> {
    try {
      // Validate admin password
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (registerProfessorDto.adminPassword !== adminPassword) {
        throw new UnauthorizedException('Invalid admin password');
      }

      // Remove admin password before creating professor
      const { adminPassword: _, ...createProfessorDto } = registerProfessorDto;
      const professor =
        await this.professorsService.createProfessor(createProfessorDto);
      return await this.generateLoginResponse(professor);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'register professor',
        { email: registerProfessorDto.email },
        [UnauthorizedException]
      );
    }
  }

  /**
   * Authenticates a professor and generates login credentials.
   *
   * @param email - Professor's email address
   * @param password - Professor's password
   * @returns LoginResponseDto containing access token and professor info
   * @throws UnauthorizedException for invalid credentials or inactive account
   */
  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const professor = await this.validateProfessor(email, password);
      return this.generateLoginResponse(professor);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'login professor',
        { email },
        [UnauthorizedException]
      );
    }
  }

  /**
   * Validates professor credentials and account status.
   *
   * @param email - Professor's email address
   * @param password - Professor's password
   * @returns Professor document if validation successful
   * @throws UnauthorizedException for invalid credentials or inactive account
   */
  async validateProfessor(email: string, password: string): Promise<Professor> {
    try {
      const professor = await this.professorModel.findOne({ email });

      if (!professor) {
        throw new UnauthorizedException(
          'No account found with this email. Please check your email or register for a new account.'
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        professor.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Incorrect password. Please try again.'
        );
      }

      if (!professor.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return professor;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'validate professor',
        { email },
        [UnauthorizedException]
      );
    }
  }

  //#endregion

  //#region Token Generation

  /**
   * Generates JWT token and formats login response.
   * Handles both Mongoose documents and DTO objects.
   *
   * @param professor - Professor document or DTO
   * @returns LoginResponseDto containing access token and professor info
   */
  private generateLoginResponse(
    professor: Professor | ProfessorResponseDto
  ): Promise<LoginResponseDto> {
    // Helper function to check if the input is a Mongoose Document
    const isMongooseDocument = (
      prof: Professor | ProfessorResponseDto
    ): prof is Professor => {
      return '_id' in prof;
    };

    const id = isMongooseDocument(professor)
      ? professor._id.toString()
      : professor.id;

    const payload = { sub: id, email: professor.email };
    const accessToken = this.jwtService.sign(payload);

    return Promise.resolve({
      accessToken,
      professor: {
        id,
        email: professor.email,
        name: professor.name,
        department: professor.department,
        title: professor.title,
      },
    });
  }

  //#endregion

  //#region Password Management

  /**
   * Initiates password reset process for forgotten passwords.
   * Generates time-limited reset token and sends reset email.
   *
   * Security features:
   * - Hashed token storage
   * - 1-hour expiration
   * - Email confirmation
   * - Silent failure for non-existent emails (prevents enumeration)
   *
   * @param email - Professor's email address
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const professor = await this.professorModel.findOne({ email });
      if (!professor) {
        // Return void even if professor not found to prevent email enumeration
        return;
      }

      const resetToken = this.jwtService.sign(
        { sub: professor._id, email: professor.email },
        { expiresIn: '1h' }
      );

      // Store hashed reset token
      const hashedToken = await bcrypt.hash(resetToken, 10);
      await this.professorModel.findByIdAndUpdate(professor._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
      });

      // Send reset email using EmailService
      await this.emailService.sendPasswordResetEmail(
        professor.email,
        professor.name.firstName,
        resetToken
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'forgot password request',
        { email }
      );
    }
  }

  /**
   * Completes password reset process using reset token.
   * Validates token and updates password.
   *
   * Validation steps:
   * 1. Verifies JWT token
   * 2. Checks token expiration
   * 3. Validates stored hashed token
   *
   * @param token - Password reset token
   * @param newPassword - New password to set
   * @throws UnauthorizedException for invalid or expired tokens
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const professor = await this.professorModel.findOne({
        _id: payload.sub,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!professor) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // Verify stored token matches
      const isValidToken = await bcrypt.compare(
        token,
        professor.resetPasswordToken
      );
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid reset token');
      }

      // Update password and clear reset token
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.professorModel.findByIdAndUpdate(professor._id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'reset password',
        {},
        [UnauthorizedException]
      );
    }
  }

  //#endregion

  //#region Admin Validation

  /**
   * Validates admin password for protected operations.
   * Used as a security check for sensitive administrative actions.
   *
   * @param email - Professor's email (for logging purposes)
   * @param adminPassword - Admin password to validate
   * @throws InvalidAdminPasswordException if password is incorrect
   */
  async validateAdminPassword(
    email: string,
    adminPassword: string
  ): Promise<void> {
    try {
      const correctAdminPassword =
        this.configService.get<string>('ADMIN_PASSWORD');
      if (adminPassword !== correctAdminPassword) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new InvalidAdminPasswordException(),
          'validate admin password',
          { email },
          [InvalidAdminPasswordException]
        );
      }
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'validate admin password',
        { email },
        [InvalidAdminPasswordException]
      );
    }
  }

  //#endregion
}
