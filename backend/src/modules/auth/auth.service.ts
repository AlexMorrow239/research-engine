import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';

import { Professor } from '../professors/schemas/professors.schema';
import { ProfessorResponseDto, RegisterProfessorDto } from '@/common/dto/professors';
import { ProfessorsService } from '../professors/professors.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private readonly jwtService: JwtService,
    private readonly professorsService: ProfessorsService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerProfessorDto: RegisterProfessorDto): Promise<LoginResponseDto> {
    try {
      // Validate admin password
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (registerProfessorDto.adminPassword !== adminPassword) {
        throw new UnauthorizedException('Invalid admin password');
      }

      // Remove admin password before creating professor
      const { adminPassword: _, ...createProfessorDto } = registerProfessorDto;
      const professor = await this.professorsService.create(createProfessorDto);
      return await this.generateLoginResponse(professor);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'register professor',
        { email: registerProfessorDto.email },
        [UnauthorizedException],
      );
    }
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const professor = await this.validateProfessor(email, password);
      return this.generateLoginResponse(professor);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'login professor', { email }, [
        UnauthorizedException,
      ]);
    }
  }

  async validateProfessor(email: string, password: string): Promise<Professor> {
    try {
      const professor = await this.professorModel.findOne({ email });

      if (!professor) {
        throw new UnauthorizedException(
          'No account found with this email. Please check your email or register for a new account.',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password. Please try again.');
      }

      if (!professor.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return professor;
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'validate professor', { email }, [
        UnauthorizedException,
      ]);
    }
  }

  private generateLoginResponse(
    professor: Professor | ProfessorResponseDto,
  ): Promise<LoginResponseDto> {
    // Helper function to check if the input is a Mongoose Document
    const isMongooseDocument = (prof: Professor | ProfessorResponseDto): prof is Professor => {
      return '_id' in prof;
    };

    const id = isMongooseDocument(professor) ? professor._id.toString() : professor.id;

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

  async forgotPassword(email: string): Promise<void> {
    try {
      const professor = await this.professorModel.findOne({ email });
      if (!professor) {
        // Return void even if professor not found to prevent email enumeration
        return;
      }

      const resetToken = this.jwtService.sign(
        { sub: professor._id, email: professor.email },
        { expiresIn: '1h' },
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
        resetToken,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'forgot password request', { email });
    }
  }

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
      const isValidToken = await bcrypt.compare(token, professor.resetPasswordToken);
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
      ErrorHandler.handleServiceError(this.logger, error, 'reset password', {}, [
        UnauthorizedException,
      ]);
    }
  }
}
