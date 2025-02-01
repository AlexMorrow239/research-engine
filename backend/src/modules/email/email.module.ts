import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CustomLogger } from '@/common/services/logger.service';
import { EmailTemplateService } from './services/email-template.service';
import { EmailService } from './email.service';
import { DownloadTokenService } from './services/download-token.service';
import { DownloadUrlService } from './services/download-url.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [],
  providers: [
    EmailService,
    EmailTemplateService,
    DownloadUrlService,
    DownloadTokenService,
    CustomLogger,
  ],
  exports: [EmailService],
})
export class EmailModule {}
