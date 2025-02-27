import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomLogger } from '@/common/services/logger.service';

import { EmailModule } from '../email/email.module';
import { ProfessorsModule } from '../professors/professors.module';
import {
  Professor,
  ProfessorSchema,
} from '../professors/schemas/professors.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// Configures authentication module and dependencies
@Module({
  imports: [
    ProfessorsModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: Professor.name, schema: ProfessorSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, CustomLogger],
  controllers: [AuthController],
})
export class AuthModule {}
