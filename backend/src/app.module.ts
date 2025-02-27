/**
 * Root module of the Research Engine API
 * Configures global settings, database connections, file uploads,
 * and imports all feature modules.
 */

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { diskStorage } from 'multer';

// Import configurations and validation schema
import { configValidationSchema } from './config/config.schema';
import * as config from './config/configuration';

// Feature modules
import { AnalyticsModule } from '@/modules/analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CustomLogger } from './common/services/logger.service';

@Module({
  imports: [
    // Core modules
    EmailModule,

    // Config Module with validation and typed configurations
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        config.databaseConfig,
        config.serverConfig,
        config.jwtConfig,
        config.awsConfig,
        config.emailConfig,
        config.environmentConfig,
        config.urlConfig,
      ],
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ScheduleModule.forRoot(),

    // Database configuration
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),

    // File upload configuration
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '..', 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),

    // Feature modules
    AuthModule,
    ProfessorsModule,
    ProjectsModule,
    ApplicationsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
})
export class AppModule {}
