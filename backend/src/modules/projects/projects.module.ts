import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApplicationsModule } from '@/modules/applications/applications.module';
import { EmailModule } from '@/modules/email/email.module';

import { ProfessorsModule } from '../professors/professors.module';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/projects.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ProjectsSchedulerService } from './projects.scheduler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ScheduleModule.forRoot(),
    ProfessorsModule,
    EmailModule,
    forwardRef(() => ApplicationsModule),
  ],
  providers: [ProjectsService, ProjectsSchedulerService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
