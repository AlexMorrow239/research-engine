import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { PasswordValidator } from '@/common/validators/password.validator';
import { CreateProfessorDto } from '../../common/dto/professors/create-professor.dto';
import { ProfessorResponseDto } from '../../common/dto/professors/professor-response.dto';
import { ReactivateAccountDto } from '../../common/dto/professors/reactivate-account.dto';
import { UpdateProfessorDto } from '../../common/dto/professors/update-professor.dto';
import { InvalidEmailDomainException } from './exceptions/invalid-email-domain.exception';
import { InvalidPasswordFormatException } from './exceptions/invalid-password-format.exception';
import { Professor } from './schemas/professors.schema';
import { CustomLogger } from '@/common/services/logger.service';

/**
 * Service responsible for managing professor accounts in the system.
 * Handles the complete lifecycle of professor accounts including:
 * - Account creation and validation
 * - Profile management
 * - Account status management (active/inactive)
 * - Authentication-related operations
 *
 * Access Control:
 * - Professors can only manage their own profiles
 * - Account reactivation requires admin password
 * - Email domains are restricted to verified university domains
 */
@Injectable()
export class ProfessorsService {
  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('ProfessorsService');
  }

  //#region Account Creation and Validation

  /**
   * Creates a new professor account.
   * Validates email domain and password requirements.
   * Ensures email uniqueness.
   *
   * @throws InvalidEmailDomainException if email is not from an approved domain
   * @throws ConflictException if email already exists
   * @throws InvalidPasswordFormatException if password doesn't meet requirements
   */
  async createProfessor(createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    try {
      this.logger.logObject(
        'debug',
        { email: createProfessorDto.email },
        'Creating new professor account',
      );

      const existingProfessor = await this.professorModel.findOne({
        email: createProfessorDto.email,
      });

      if (existingProfessor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new ConflictException('Email already exists'),
          'check email uniqueness',
          { email: createProfessorDto.email },
          [ConflictException],
        );
      }

      const newProfessor = await this.professorModel.create({
        ...createProfessorDto,
        isActive: true,
      });

      const { password: _, ...result } = newProfessor.toObject();
      this.logger.logObject(
        'debug',
        { professorId: result._id },
        'Professor account created successfully',
      );
      return result as ProfessorResponseDto;
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'create professor account',
        { email: createProfessorDto.email },
        [InvalidEmailDomainException, ConflictException],
      );
    }
  }

  //#endregion

  //#region Profile Management

  /**
   * Retrieves a professor's profile information.
   * Excludes sensitive data like password from the response.
   */
  async getProfessor(professorId: string): Promise<ProfessorResponseDto> {
    try {
      this.logger.logObject('debug', { professorId }, 'Fetching professor profile');

      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new NotFoundException('Professor not found'),
          'find professor by id',
          { professorId },
          [NotFoundException],
        );
      }

      const { password: _, ...result } = professor.toObject();
      this.logger.logObject('debug', { professorId }, 'Professor profile retrieved successfully');
      return result as ProfessorResponseDto;
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'get professor profile',
        { professorId },
        [NotFoundException],
      );
    }
  }

  /**
   * Updates a professor's profile information.
   * Only allows updating non-sensitive fields.
   */
  async updateProfessor(
    professorId: string,
    updateProfileDto: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    try {
      this.logger.logObject(
        'debug',
        { professorId, updates: updateProfileDto },
        'Attempting to update professor profile',
      );

      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new NotFoundException('Professor not found'),
          'find professor by id',
          { professorId },
          [NotFoundException],
        );
      }

      const updatedProfessor = await this.professorModel.findByIdAndUpdate(
        professorId,
        { $set: updateProfileDto },
        { new: true },
      );

      const { password: _, ...result } = updatedProfessor.toObject();
      this.logger.logObject('debug', { professorId }, 'Professor profile updated successfully');
      return result as ProfessorResponseDto;
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update professor profile',
        { professorId },
        [NotFoundException],
      );
    }
  }

  /**
   * Changes a professor's password.
   * Validates current password and ensures new password meets requirements.
   *
   * @throws UnauthorizedException if current password is incorrect
   * @throws BadRequestException if new password is same as current
   * @throws InvalidPasswordFormatException if new password doesn't meet requirements
   */
  async changeProfessorPassword(
    professorId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      this.logger.logObject('debug', { professorId }, 'Attempting to change professor password');

      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new NotFoundException('Professor not found'),
          'find professor by id',
          { professorId },
          [NotFoundException],
        );
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, professor.password);
      if (!isPasswordValid) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new UnauthorizedException('Current password is incorrect'),
          'validate current password',
          { professorId },
          [UnauthorizedException],
        );
      }

      const isSamePassword = await bcrypt.compare(newPassword, professor.password);
      if (isSamePassword) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new BadRequestException('New password must be different from current password'),
          'validate password change',
          { professorId },
          [BadRequestException],
        );
      }

      if (!PasswordValidator.validate(newPassword)) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new InvalidPasswordFormatException(PasswordValidator.getRequirements()),
          'validate new password format',
          { professorId },
          [InvalidPasswordFormatException],
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.professorModel.findByIdAndUpdate(professorId, {
        password: hashedPassword,
      });

      this.logger.logObject('debug', { professorId }, 'Professor password changed successfully');
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'change professor password',
        { professorId },
        [
          NotFoundException,
          UnauthorizedException,
          BadRequestException,
          InvalidPasswordFormatException,
        ],
      );
    }
  }

  //#endregion

  //#region Account Status Management

  /**
   * Deactivates a professor's account.
   * Deactivated accounts cannot log in but remain in the database.
   * This is preferred over deletion to maintain data integrity with related records.
   */
  async deactivateProfessorAccount(professorId: string): Promise<void> {
    try {
      this.logger.logObject('debug', { professorId }, 'Attempting to deactivate professor account');

      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new NotFoundException('Professor not found'),
          'find professor by id',
          { professorId },
          [NotFoundException],
        );
      }

      await this.professorModel.findByIdAndUpdate(professorId, {
        isActive: false,
      });

      this.logger.logObject('debug', { professorId }, 'Professor account deactivated successfully');
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'deactivate professor account',
        { professorId },
        [NotFoundException],
      );
    }
  }

  /**
   * Reactivates a previously deactivated professor account.
   * Part of a two-step validation process where admin password is validated separately.
   *
   * Process:
   * 1. Validates professor exists
   * 2. Validates professor password
   * 3. Checks if account is already active
   * 4. Reactivates the account
   *
   * @param reactivateAccountDto - Contains professor email and password
   * @throws UnauthorizedException if professor not found or invalid password
   * @throws BadRequestException if account is already active
   */
  async reactivateProfessorAccount(reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    try {
      const { email, password } = reactivateAccountDto;

      this.logger.logObject('debug', { email }, 'Attempting to reactivate professor account');

      const professor = await this.professorModel.findOne({ email });
      if (!professor) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new UnauthorizedException('Invalid credentials'),
          'find professor by email',
          { email },
          [UnauthorizedException],
        );
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);
      if (!isPasswordValid) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new UnauthorizedException('Invalid credentials'),
          'validate professor password',
          { email },
          [UnauthorizedException],
        );
      }

      if (professor.isActive) {
        throw ErrorHandler.handleServiceError(
          this.logger,
          new BadRequestException('Account is already active'),
          'check account status',
          { email },
          [BadRequestException],
        );
      }

      await this.professorModel.findByIdAndUpdate(professor.id, {
        isActive: true,
      });

      this.logger.logObject('debug', { email }, 'Professor account reactivated successfully');
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'reactivate professor account',
        { email: reactivateAccountDto.email },
        [UnauthorizedException, BadRequestException],
      );
    }
  }

  //#endregion
}
