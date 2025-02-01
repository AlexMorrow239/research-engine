import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DownloadTokenModule } from '../file-storage/download-token.module';
import { DownloadUrlService } from '../file-storage/download-url.service';
import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';
import { CustomLogger } from '@/common/services/logger.service';

@Module({
  imports: [ConfigModule, DownloadTokenModule],
  providers: [
    EmailService,
    EmailConfigService,
    EmailTemplateService,
    DownloadUrlService,
    CustomLogger,
  ],
  exports: [EmailService],
})
export class EmailModule {}
