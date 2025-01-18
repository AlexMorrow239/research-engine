import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';

import { Professor } from '../professors/schemas/professors.schema';
import { CreateProfessorDto, ProfessorResponseDto } from '@/common/dto/professors';
import { ProfessorsService } from '../professors/professors.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private readonly jwtService: JwtService,
    private readonly professorsService: ProfessorsService,
  ) {}

  async register(createProfessorDto: CreateProfessorDto): Promise<LoginResponseDto> {
    try {
      const professor = await this.professorsService.create(createProfessorDto);
      return await this.generateLoginResponse(professor);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'register professor', {
        email: createProfessorDto.email,
      });
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
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
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
}
