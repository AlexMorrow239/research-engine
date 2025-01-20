import { Logger, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailModule } from '../email/email.module';
import { ProjectsModule } from '../projects/projects.module';

import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application, ApplicationSchema } from './schemas/applications.schema';

import { AwsS3Service } from '@/common/services/aws-s3.service';
import { AnalyticsModule } from '@/modules/analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
    forwardRef(() => ProjectsModule),
    EmailModule,
    AnalyticsModule,
  ],
  providers: [ApplicationsService, AwsS3Service, Logger],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
