import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';

import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Professor } from '../../professors/schemas/professors.schema';

// Handles JWT validation strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const professor = await this.professorModel.findById(payload.sub);
      if (!professor) {
        throw new UnauthorizedException('Professor not found');
      }
      return professor;
    } catch (error) {
      // Check if error is TokenExpiredError from jsonwebtoken
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({ message: 'Token expired', expired: true });
      }
      throw error;
    }
  }
}
