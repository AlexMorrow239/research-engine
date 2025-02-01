import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyticsDto } from '@/common/dto/analytics/analytics.dto';
import { ApplicationStatus } from '@/common/enums';
import { CustomLogger } from '@/common/services/logger.service';
import { Application } from '@/modules/applications/schemas/applications.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<Application>,
    private readonly logger: CustomLogger,
  ) {}

  async getProjectAnalytics(projectId: string): Promise<AnalyticsDto> {
    try {
      const [metrics] = await this.applicationModel.aggregate([
        { $match: { project: projectId } },
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            pendingApplications: {
              $sum: { $cond: [{ $eq: ['$status', ApplicationStatus.PENDING] }, 1, 0] },
            },
            closedApplications: {
              $sum: { $cond: [{ $eq: ['$status', ApplicationStatus.CLOSED] }, 1, 0] },
            },
          },
        },
      ]);

      return this.formatAnalytics(metrics || {});
    } catch (error) {
      this.logger.error(`Failed to get analytics for project ${projectId}`, error.stack);
      throw error;
    }
  }

  async getGlobalAnalytics(): Promise<AnalyticsDto> {
    try {
      const [metrics] = await this.applicationModel.aggregate([
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            pendingApplications: {
              $sum: { $cond: [{ $eq: ['$status', ApplicationStatus.PENDING] }, 1, 0] },
            },
            closedApplications: {
              $sum: { $cond: [{ $eq: ['$status', ApplicationStatus.CLOSED] }, 1, 0] },
            },
          },
        },
      ]);

      return this.formatAnalytics(metrics || {});
    } catch (error) {
      this.logger.error('Failed to get global analytics', error.stack);
      throw error;
    }
  }

  private formatAnalytics(metrics: any): AnalyticsDto {
    const { totalApplications = 0, pendingApplications = 0, closedApplications = 0 } = metrics;

    return {
      applicationFunnel: {
        totalApplications,
        pendingApplications,
        closedApplications,
        closeRate: totalApplications > 0 ? (closedApplications / totalApplications) * 100 : 0,
      },
      lastUpdated: new Date(),
    };
  }
}
