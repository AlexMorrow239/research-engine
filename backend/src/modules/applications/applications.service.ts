import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ApplicationStatus, ProjectStatus } from '@/common/enums';
import { ApplicationDeadlinePassedException } from '@/common/exceptions/application.exception';
import { AwsS3Service } from '@/common/services/aws-s3.service';
import { CustomLogger } from '@/common/services/logger.service';
import { ErrorHandler } from '@/common/utils/error-handler.util';

import { CreateApplicationDto } from '../../common/dto/applications/create-application.dto';
import { EmailService } from '../email/email.service';
import { ProjectsService } from '../projects/projects.service';
import { Application } from './schemas/applications.schema';

/**
 * Service handling project application lifecycle management.
 * Manages the complete process of student applications including:
 * - Application submission and validation
 * - Resume file handling with AWS S3
 * - Application status management
 * - Email notifications
 *
 * Integration Points:
 * - AWS S3 for resume storage
 * - Email service for notifications
 * - Projects service for validation
 *
 * Security Features:
 * - Professor ownership validation
 * - File type validation
 * - Secure resume access via signed URLs
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    private readonly emailService: EmailService,
    private readonly s3Service: AwsS3Service,
    private readonly logger: CustomLogger
  ) {}

  //#region File Management

  /**
   * Generates a unique key for storing resume files in S3.
   * Format: applications/{projectId}/cv/{timestamp}-{sanitizedFileName}
   *
   * @param projectId - Project identifier
   * @param originalName - Original resume file name
   * @returns Sanitized and unique S3 key
   */
  private generateResumeKey(projectId: string, originalName: string): string {
    try {
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
      const timestamp = Date.now();
      const resumeKey = `applications/${projectId}/cv/${timestamp}-${sanitizedName}`;

      return resumeKey;
    } catch (error) {
      this.logger.error(
        `Failed to generate resume key: ${error.message}`,
        error.stack,
        'generateResumeKey'
      );
      throw error;
    }
  }

  /**
   * Determines MIME type based on file extension.
   * Used for resume file downloads.
   *
   * @param fileName - Name of the file
   * @returns Appropriate MIME type or default octet-stream
   */
  private getMimeType(fileName: string): string {
    if (!fileName) {
      this.logger.debug('No filename provided, using default mime type');
      return 'application/octet-stream';
    }

    try {
      const extension = fileName.split('.').pop()?.toLowerCase();
      let mimeType: string;

      switch (extension) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'doc':
          mimeType = 'application/msword';
          break;
        case 'docx':
          mimeType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      return mimeType;
    } catch (error) {
      this.logger.error(
        'Failed to determine mime type',
        error.stack,
        'getMimeType'
      );
      return 'application/octet-stream';
    }
  }

  //#endregion

  //#region Application Management

  /**
   * Creates a new project application.
   * Handles complete application process including:
   * - Project validation
   * - Deadline checking
   * - Duplicate prevention
   * - Resume upload
   * - Email notifications
   *
   * @param createApplicationDto - Application data
   * @param resume - Resume file
   * @throws BadRequestException for validation failures
   * @throws ApplicationDeadlinePassedException if deadline passed
   * @throws NotFoundException if project not found
   */
  async create(
    createApplicationDto: CreateApplicationDto,
    resume: Express.Multer.File
  ) {
    try {
      // Validate project exists and is accepting applications
      const project = await this.projectsService.findOne(
        createApplicationDto.projectId
      );
      if (!project) {
        this.logger.warn(
          `Project not found: ${createApplicationDto.projectId}`
        );
        throw new NotFoundException('Project not found');
      }

      // Project status validation
      if (project.status !== ProjectStatus.PUBLISHED) {
        this.logger.warn(
          `Attempted to apply to non-published project: ${project.id}, status: ${project.status}`
        );
        throw new BadRequestException('Project is not accepting applications');
      }

      // Deadline validation
      if (
        project.applicationDeadline &&
        new Date() > new Date(project.applicationDeadline)
      ) {
        this.logger.warn(
          `Application submitted after deadline for project ${project.id}`,
          'DeadlineValidation'
        );
        throw new ApplicationDeadlinePassedException(
          new Date(project.applicationDeadline)
        );
      }

      // Duplicate check
      const existingApplication = await this.applicationModel.findOne({
        project: createApplicationDto.projectId,
        'studentInfo.cNumber': createApplicationDto.studentInfo.cNumber,
      });

      if (existingApplication) {
        this.logger.warn(
          `Duplicate application attempt: Student ${createApplicationDto.studentInfo.cNumber} for project ${project.id}`
        );
        throw new BadRequestException(
          'You have already applied to this project'
        );
      }

      // Resume handling
      const resumeKey = this.generateResumeKey(
        createApplicationDto.projectId,
        resume.originalname
      );

      try {
        await this.s3Service.uploadFile(resume, resumeKey);
      } catch (error) {
        ErrorHandler.handleServiceError(
          this.logger,
          error,
          'upload resume to S3',
          { projectId: project.id, resumeKey },
          [BadRequestException]
        );
      }

      // Create and save application
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

      const savedApplication = await application.save();
      if (!savedApplication) {
        await this.s3Service.deleteFile(resumeKey);
        ErrorHandler.handleServiceError(
          this.logger,
          new Error('Failed to save application'),
          'save application to database',
          { projectId: project.id }
        );
      }

      // Populate project details
      const populatedApplication = await savedApplication.populate({
        path: 'project',
        populate: {
          path: 'professor',
          select: 'email name',
        },
      });

      // Send notifications
      try {
        await this.emailService.sendApplicationConfirmation(
          savedApplication,
          project.title
        );
        await this.emailService.sendProfessorNewApplication(
          project.professor.email,
          savedApplication,
          project.title
        );
      } catch (emailError) {
        // Non-critical error - log but don't throw
        this.logger.error(
          'Failed to send confirmation emails',
          emailError.stack,
          'EmailNotification'
        );
      }

      this.logger.log(
        `Application created successfully for project ${project.id}`
      );

      return populatedApplication;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'create application',
        {
          projectId: createApplicationDto.projectId,
          studentCNumber: createApplicationDto.studentInfo.cNumber,
        },
        [
          NotFoundException,
          BadRequestException,
          ApplicationDeadlinePassedException,
        ]
      );
    }
  }

  /**
   * Updates application status and handles related operations.
   * - Verifies professor ownership
   * - Sends email notifications
   *
   * @param professorId - ID of professor updating status
   * @param applicationId - Application to update
   * @param status - New status to set
   * @throws NotFoundException if application not found or professor not authorized
   */
  async updateStatus(
    professorId: string,
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application> {
    try {
      const application = await this.applicationModel
        .findById(applicationId)
        .populate({
          path: 'project',
          populate: {
            path: 'professor',
            select: 'id email name',
          },
        });

      if (!application) {
        this.logger.warn(
          `Attempted to update non-existent application: ${applicationId}`
        );
        throw new NotFoundException('Application not found');
      }

      if (application.project.professor.toString() !== professorId) {
        this.logger.warn(
          `Unauthorized status update attempt: Professor ${professorId} for application ${applicationId}`
        );
        throw new NotFoundException('Application not found');
      }

      const oldStatus = application.status;

      const updatedApplication = await this.applicationModel
        .findByIdAndUpdate(applicationId, { status }, { new: true })
        .populate('project');

      // Send email notification
      try {
        await this.emailService.sendApplicationStatusUpdate(
          application.studentInfo.email,
          application.project.title,
          status
        );
      } catch (emailError) {
        // Non-critical error - log but don't throw
        this.logger.error(
          'Failed to send status update email',
          emailError.stack,
          'EmailNotification'
        );
      }

      this.logger.log(
        `Application ${applicationId} status updated from ${oldStatus} to ${status}`
      );

      return updatedApplication;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update application status',
        { applicationId, professorId, status },
        [NotFoundException]
      );
    }
  }

  /**
   * Retrieves applications for a specific project.
   * Validates professor ownership before returning results.
   *
   * @param professorId - ID of requesting professor
   * @param projectId - Project to get applications for
   * @param status - Optional status filter
   * @throws NotFoundException if project not found or professor not authorized
   */
  async findProjectApplications(
    professorId: string,
    projectId: string,
    status?: ApplicationStatus
  ): Promise<Application[]> {
    try {
      const project = await this.projectsService.findOne(projectId);

      if (project.professor.id.toString() !== professorId) {
        this.logger.warn(
          `Unauthorized applications access attempt: Professor ${professorId} for project ${projectId}`
        );
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

      this.logger.log(
        `Retrieved ${applications.length} applications for project ${projectId}`
      );

      return applications;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'fetch project applications',
        { projectId, professorId, status },
        [NotFoundException]
      );
    }
  }

  /**
   * Generates a secure, temporary URL for resume access.
   * Validates professor ownership before providing access.
   *
   * @param professorId - ID of requesting professor
   * @param applicationId - Application containing resume
   * @returns Object containing URL and file metadata
   * @throws NotFoundException if application not found or professor not authorized
   */
  async getResume(
    professorId: string,
    applicationId: string
  ): Promise<{ url: string; fileName: string; mimeType: string }> {
    try {
      const application = await this.applicationModel
        .findById(applicationId)
        .populate({
          path: 'project',
          select: 'professor',
        });

      if (
        !application ||
        application.project.professor.toString() !== professorId
      ) {
        this.logger.warn(
          `Unauthorized resume access attempt: Professor ${professorId} for application ${applicationId}`
        );
        throw new NotFoundException('Application not found');
      }

      if (!application.resumePath) {
        this.logger.warn(
          `Resume path not found for application ${applicationId}`,
          'ResumeAccess'
        );
        throw new NotFoundException('Resume not found');
      }
      const fileName = application.resumePath.split('/').pop();
      const mimeType = this.getMimeType(fileName);
      const url = await this.s3Service.getSignedUrl(application.resumePath);

      return { url, fileName, mimeType };
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'retrieve resume',
        { applicationId, professorId },
        [NotFoundException]
      );
    }
  }

  //#endregion

  //#region Batch Operations

  /**
   * Closes all pending applications for a project.
   * Used when project status changes or deadline passes.
   *
   * @param projectId - Project to close applications for
   */
  async closeProjectApplications(projectId: string): Promise<void> {
    try {
      this.logger.log(
        `Closing all pending applications for project ${projectId}`
      );

      const result = await this.applicationModel.updateMany(
        { project: projectId, status: ApplicationStatus.PENDING },
        { status: ApplicationStatus.CLOSED }
      );

      if (result.matchedCount === 0) {
        this.logger.debug(
          `No pending applications found for project ${projectId}`,
          'BatchUpdate'
        );
        return;
      }
      this.logger.log(
        `Successfully closed ${result.modifiedCount} pending applications for project ${projectId}`
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'close project applications',
        {
          projectId,
          operation: 'batch_close',
        }
      );
    }
  }

  /**
   * Deletes an application and associated resources.
   * Validates professor ownership before deletion.
   * Handles cleanup of S3 stored resume.
   *
   * @param professorId - ID of requesting professor
   * @param applicationId - Application to delete
   * @throws NotFoundException if application not found or professor not authorized
   */
  async deleteApplication(
    professorId: string,
    applicationId: string
  ): Promise<void> {
    try {
      const application = await this.applicationModel
        .findById(applicationId)
        .populate({
          path: 'project',
          select: 'professor',
        });

      if (
        !application ||
        application.project.professor.toString() !== professorId
      ) {
        this.logger.warn(
          `Unauthorized deletion attempt: Professor ${professorId} for application ${applicationId}`
        );
        throw new NotFoundException('Application not found');
      }

      // Handle resume file deletion if exists
      if (application.resumePath) {
        this.logger.logObject(
          'debug',
          {
            applicationId,
            resumePath: application.resumePath,
          },
          'Deleting associated resume file'
        );

        try {
          await this.s3Service.deleteFile(application.resumePath);
          this.logger.debug(
            `Resume file deleted successfully for application ${applicationId}`,
            'S3Cleanup'
          );
        } catch (s3Error) {
          // Log but continue with application deletion
          this.logger.error(
            'Failed to delete resume file from S3',
            s3Error.stack,
            'S3Cleanup'
          );
        }
      }

      // Delete the application
      await application.deleteOne();

      this.logger.logObject(
        'debug',
        {
          applicationId,
          projectId: application.project.id,
          hadResume: !!application.resumePath,
        },
        'Application deleted successfully'
      );

      this.logger.log(`Application ${applicationId} deleted successfully`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'delete application',
        { applicationId, professorId },
        [NotFoundException]
      );
    }
  }

  //#endregion
}
