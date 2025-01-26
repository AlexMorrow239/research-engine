import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectsSchedulerService {
  private readonly logger = new Logger(ProjectsSchedulerService.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleProjectDeadlines() {
    this.logger.log('Checking for expired projects...');
    await this.projectsService.closeExpiredProjects();
  }
}
