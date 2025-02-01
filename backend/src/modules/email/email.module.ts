import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomLogger } from '@/common/services/logger.service';
import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './services/email-template.service';
import { EmailService } from './email.service';
import { DownloadTokenService } from './services/download-token.service';
import { DownloadUrlService } from './services/download-url.service';
import { EmailTrackingController } from './controllers/email-tracking.controller';
import { EmailTrackingService } from './services/email-tracking.service';
import { EmailTracking, EmailTrackingSchema } from './schemas/email-tracking.schema';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: EmailTracking.name, schema: EmailTrackingSchema }]),
  ],
  controllers: [EmailTrackingController],
  providers: [
    EmailService,
    EmailConfigService,
    EmailTemplateService,
    DownloadUrlService,
    DownloadTokenService,
    EmailTrackingService,
    CustomLogger,
  ],
  exports: [EmailService],
})
export class EmailModule {}
