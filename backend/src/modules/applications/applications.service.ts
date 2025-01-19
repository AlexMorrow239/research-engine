import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateApplicationDto } from '../../common/dto/applications/create-application.dto';

import { EmailService } from '../email/email.service';
import { ProjectsService } from '../projects/projects.service';

import { Application } from './schemas/applications.schema';

import { ApplicationStatus } from '@/common/enums';
import { AwsS3Service } from '@/common/services/aws-s3.service';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { AnalyticsService } from '@/modules/analytics/analytics.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    private readonly emailService: EmailService,
    private readonly analyticsService: AnalyticsService,
    private readonly s3Service: AwsS3Service,
  ) {}

  private generateResumeKey(projectId: string, originalName: string): string {
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const timestamp = Date.now();
    return `applications/${projectId}/cv/${timestamp}-${sanitizedName}`;
  }

  async create(createApplicationDto: CreateApplicationDto, resume: Express.Multer.File) {
    try {
      // Generate a unique key for the resume file using projectId
      const resumeKey = this.generateResumeKey(createApplicationDto.projectId, resume.originalname);
      this.logger.debug('Uploading resume', { key: resumeKey });

      // Upload the resume file to S3
      await this.s3Service.uploadFile(resume, resumeKey);

      // Create the application with the resume path
      const application = new this.applicationModel({
        project: createApplicationDto.projectId,
        studentInfo: createApplicationDto.studentInfo,
        availability: createApplicationDto.availability,
        additionalInfo: createApplicationDto.additionalInfo,
        resumePath: resumeKey,
        status: ApplicationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the application
      const savedApplication = await application.save();

      if (!savedApplication) {
        await this.s3Service.deleteFile(resumeKey);
        throw new Error('Failed to save application');
      }

      // Track analytics
      await this.analyticsService.updateApplicationMetrics(
        savedApplication.project.toString(),
        null,
        ApplicationStatus.PENDING,
      );

      this.logger.debug('Application created successfully', {
        applicationId: savedApplication.id,
        resumePath: resumeKey,
      });

      return savedApplication;
    } catch (error) {
      this.logger.error('Failed to create application', {
        error: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(`Failed to create application: ${error.message}`);
    }
  }

  async updateStatus(
    professorId: string,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    try {
      const application = await this.applicationModel.findById(applicationId).populate({
        path: 'project',
        populate: {
          path: 'professor',
          select: 'id email name',
        },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // Add this check to verify professor ownership
      if (application.project.professor.toString() !== professorId) {
        throw new NotFoundException('Application not found');
      }

      const oldStatus = application.status;
      const updatedApplication = await this.applicationModel
        .findByIdAndUpdate(applicationId, { status }, { new: true })
        .populate('project');

      // Update analytics for status change
      await this.analyticsService.updateApplicationMetrics(
        application.project.id,
        oldStatus,
        status,
      );

      await this.emailService.sendApplicationStatusUpdate(
        application.studentInfo.email,
        application.project.title,
        status,
      );

      this.logger.log(`Application ${applicationId} status updated to ${status}`);
      return updatedApplication;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update application status',
        { applicationId, professorId, status },
        [NotFoundException],
      );
    }
  }

  async findProjectApplications(
    professorId: string,
    projectId: string,
    status?: ApplicationStatus,
  ): Promise<Application[]> {
    try {
      const project = await this.projectsService.findOne(projectId);

      if (project.professor.id.toString() !== professorId) {
        throw new NotFoundException('Project not found');
      }

      const filter: any = { project: projectId };
      if (status) {
        filter.status = status;
      }

      const applications = await this.applicationModel
        .find(filter)
        .populate('project')
        .sort({ createdAt: -1 });

      this.logger.log(`Retrieved ${applications.length} applications for project ${projectId}`);
      return applications;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'fetch project applications',
        { projectId, professorId, status },
        [NotFoundException],
      );
    }
  }

  async getResume(
    professorId: string,
    applicationId: string,
  ): Promise<{ url: string; fileName: string; mimeType: string }> {
    try {
      const application = await this.applicationModel.findById(applicationId).populate({
        path: 'project',
        select: 'professor',
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.project.professor.toString() !== professorId) {
        throw new NotFoundException('Application not found');
      }

      if (!application.resumePath) {
        throw new NotFoundException('Resume not found');
      }

      const fileName = application.resumePath.split('/').pop();
      const mimeType = this.getMimeType(fileName);

      // Generate a pre-signed URL for temporary access to the file
      const url = await this.s3Service.getSignedUrl(application.resumePath);

      this.logger.log(`Resume URL generated for application ${applicationId}`);
      return {
        url,
        fileName,
        mimeType,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'retrieve resume',
        { applicationId, professorId },
        [NotFoundException],
      );
    }
  }

  private getMimeType(fileName: string): string {
    if (!fileName) {
      return 'application/octet-stream';
    }

    try {
      const extension = fileName.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return 'application/pdf';
        case 'doc':
          return 'application/msword';
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default:
          return 'application/octet-stream';
      }
    } catch (error) {
      this.logger.error('Failed to determine mime type', {
        fileName,
        error: error.message,
      });
      return 'application/octet-stream';
    }
  }

  async closeProjectApplications(projectId: string): Promise<void> {
    try {
      this.logger.log(`Closing all pending applications for project ${projectId}`);

      const result = await this.applicationModel.updateMany(
        {
          project: projectId,
          status: ApplicationStatus.PENDING,
        },
        {
          status: ApplicationStatus.CLOSED,
        },
      );

      this.logger.log(
        `Successfully closed ${result.modifiedCount} pending applications for project ${projectId}`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'close project applications', {
        projectId,
      });
    }
  }

  async deleteApplication(professorId: string, applicationId: string): Promise<void> {
    try {
      const application = await this.applicationModel.findById(applicationId).populate({
        path: 'project',
        select: 'professor',
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.project.professor.toString() !== professorId) {
        throw new NotFoundException('Application not found');
      }

      // Delete resume from S3 if it exists
      if (application.resumePath) {
        await this.s3Service.deleteFile(application.resumePath);
      }

      await application.deleteOne();
      this.logger.log(`Application ${applicationId} deleted successfully`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'delete application',
        { applicationId, professorId },
        [NotFoundException],
      );
    }
  }
}
