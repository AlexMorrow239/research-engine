import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';
import { DownloadTokenModule } from '../file-storage/download-token.module';
import { DownloadUrlService } from '../file-storage/download-url.service';

@Module({
  imports: [ConfigModule, DownloadTokenModule],
  providers: [EmailService, EmailConfigService, EmailTemplateService, DownloadUrlService, Logger],
  exports: [EmailService],
})
export class EmailModule {}
