import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomLogger } from '@/common/services/logger.service';
import { ProjectsService } from './projects.service';

/**
 * Service responsible for handling scheduled tasks related to projects.
 * This includes automated processes like closing expired projects and
 * maintaining project statuses.
 */
@Injectable()
export class ProjectsSchedulerService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('ProjectScheduler');
  }

  /**
   * Automatically closes projects that have passed their application deadline.
   * Runs daily at 1 AM to:
   * 1. Find all published projects with passed deadlines
   * 2. Close these projects and mark them as invisible
   * 3. Close all pending applications
   * 4. Send notifications to affected students
   *
   * @returns The number of projects that were closed
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleProjectDeadlines() {
    this.logger.log('Starting daily project deadline check...');

    try {
      const startTime = Date.now();
      const result = await this.projectsService.closeExpiredProjects();
      const duration = Date.now() - startTime;

      this.logger.logObject(
        'log',
        {
          closedProjects: result || 0,
          executionTimeMs: duration,
          timestamp: new Date().toISOString(),
        },
        'Project deadline check completed successfully',
      );
      return result;
    } catch (error) {
      this.logger.error('Failed to process project deadlines', error?.stack);

      this.logger.logObject(
        'error',
        {
          error: error?.message,
          timestamp: new Date().toISOString(),
        },
        'Project deadline check failed',
      );
    }
  }
}
