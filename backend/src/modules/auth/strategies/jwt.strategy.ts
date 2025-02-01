import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Professor } from '../../professors/schemas/professors.schema';
import { CustomLogger } from '@common/services/logger.service';
import { ErrorHandler } from '@common/utils/error-handler.util';

/**
 * JWT Strategy implementation for Passport authentication.
 * Validates JWT tokens and retrieves associated professor profiles.
 *
 * Configuration:
 * - Extracts JWT from Authorization Bearer header
 * - Validates token expiration
 * - Uses environment-configured JWT secret
 *
 * Integration Points:
 * - Used by JwtAuthGuard for route protection
 * - Interfaces with ProfessorModel for profile validation
 * - Consumed by @UseGuards(JwtAuthGuard) decorator
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private readonly logger: CustomLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    this.logger.setContext('JwtStrategy');
  }

  /**
   * Validates JWT payload and retrieves professor profile.
   * Called automatically by Passport after token is verified.
   *
   * @param payload - Decoded JWT payload containing professor ID
   * @returns Professor document if validation successful
   * @throws UnauthorizedException if professor not found
   */
  async validate(payload: any) {
    try {
      const professor = await this.professorModel.findById(payload.sub);
      if (!professor) {
        throw new UnauthorizedException('Professor not found');
      }
      return professor;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'validate JWT token',
        { professorId: payload?.sub },
        [UnauthorizedException],
      );
    }
  }
}
