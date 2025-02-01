import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { ApplicationsModule } from '@/modules/applications/applications.module';
import { EmailModule } from '@/modules/email/email.module';

import { ProfessorsModule } from '../professors/professors.module';
import { ProjectsController } from './projects.controller';
import { ProjectsSchedulerService } from './projects.scheduler.service';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/projects.schema';
import { CustomLogger } from '@/common/services/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ScheduleModule.forRoot(),
    ProfessorsModule,
    EmailModule,
    forwardRef(() => ApplicationsModule),
  ],
  providers: [ProjectsService, ProjectsSchedulerService, CustomLogger],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
