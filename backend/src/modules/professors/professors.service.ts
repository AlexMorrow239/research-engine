import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { ErrorHandler } from "@/common/utils/error-handler.util";
import { PasswordValidator } from "@/common/validators/password.validator";

import {
  CreateProfessorDto,
  RegisterProfessorDto,
} from "../../common/dto/professors/create-professor.dto";
import { ProfessorResponseDto } from "../../common/dto/professors/professor-response.dto";
import { ReactivateAccountDto } from "../../common/dto/professors/reactivate-account.dto";
import { UpdateProfessorDto } from "../../common/dto/professors/update-professor.dto";
import { InvalidEmailDomainException } from "./exceptions/invalid-email-domain.exception";
import { InvalidPasswordFormatException } from "./exceptions/invalid-password-format.exception";
import { InvalidAdminPasswordException } from "./exceptions/password.exception";
import { Professor } from "./schemas/professors.schema";

@Injectable()
export class ProfessorsService {
  private readonly logger = new Logger(ProfessorsService.name);

  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private configService: ConfigService
  ) {}

  async create(
    createProfessorDto: CreateProfessorDto
  ): Promise<ProfessorResponseDto> {
    try {
      const validDomains = ["@miami.edu", "@med.miami.edu", "@cd.miami.edu"];
      if (
        !validDomains.some((domain) =>
          createProfessorDto.email.endsWith(domain)
        )
      ) {
        throw new InvalidEmailDomainException();
      }

      const existingProfessor = await this.professorModel.findOne({
        email: createProfessorDto.email,
      });

      if (existingProfessor) {
        throw new ConflictException("Email already exists");
      }

      if (!PasswordValidator.validate(createProfessorDto.password)) {
        throw new InvalidPasswordFormatException(
          PasswordValidator.getRequirements()
        );
      }

      const hashedPassword = await bcrypt.hash(createProfessorDto.password, 10);

      const newProfessor = await this.professorModel.create({
        ...createProfessorDto,
        password: hashedPassword,
        isActive: true,
      });

      const { password: _, ...result } = newProfessor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "create professor account",
        { email: createProfessorDto.email },
        [
          InvalidEmailDomainException,
          InvalidPasswordFormatException,
          ConflictException,
        ]
      );
    }
  }

  async updateProfile(
    professorId: string,
    updateProfileDto: UpdateProfessorDto
  ): Promise<ProfessorResponseDto> {
    try {
      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw new NotFoundException("Professor not found");
      }

      const updatedProfessor = await this.professorModel.findByIdAndUpdate(
        professorId,
        { $set: updateProfileDto },
        { new: true }
      );

      const { password: _, ...result } = updatedProfessor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "update professor profile",
        { professorId },
        [NotFoundException]
      );
    }
  }

  async changePassword(
    professorId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw new NotFoundException("Professor not found");
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        professor.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      const isSamePassword = await bcrypt.compare(
        newPassword,
        professor.password
      );
      if (isSamePassword) {
        throw new BadRequestException(
          "New password must be different from current password"
        );
      }

      if (!PasswordValidator.validate(newPassword)) {
        throw new InvalidPasswordFormatException(
          PasswordValidator.getRequirements()
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.professorModel.findByIdAndUpdate(professorId, {
        password: hashedPassword,
      });
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "change professor password",
        { professorId },
        [
          NotFoundException,
          UnauthorizedException,
          BadRequestException,
          InvalidPasswordFormatException,
        ]
      );
    }
  }

  async getProfile(professorId: string): Promise<ProfessorResponseDto> {
    try {
      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw new NotFoundException("Professor not found");
      }

      const { password: _, ...result } = professor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "get professor profile",
        { professorId },
        [NotFoundException]
      );
    }
  }

  async deactivateAccount(professorId: string): Promise<void> {
    try {
      const professor = await this.professorModel.findById(professorId);
      if (!professor) {
        throw new NotFoundException("Professor not found");
      }

      await this.professorModel.findByIdAndUpdate(professorId, {
        isActive: false,
      });

      this.logger.log(
        `Successfully deactivated account for professor: ${professorId}`
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "deactivate professor account",
        { professorId },
        [NotFoundException]
      );
    }
  }

  async reactivateAccount(
    reactivateAccountDto: ReactivateAccountDto
  ): Promise<void> {
    try {
      const { email, password, adminPassword } = reactivateAccountDto;

      const correctAdminPassword =
        this.configService.get<string>("ADMIN_PASSWORD");
      if (adminPassword !== correctAdminPassword) {
        throw new InvalidAdminPasswordException();
      }

      const professor = await this.professorModel.findOne({ email });
      if (!professor) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        professor.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      if (professor.isActive) {
        throw new BadRequestException("Account is already active");
      }

      await this.professorModel.findByIdAndUpdate(professor.id, {
        isActive: true,
      });

      this.logger.log(
        `Successfully reactivated account for professor: ${email}`
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "reactivate professor account",
        { email: reactivateAccountDto.email },
        [
          InvalidAdminPasswordException,
          UnauthorizedException,
          BadRequestException,
        ]
      );
    }
  }
}
