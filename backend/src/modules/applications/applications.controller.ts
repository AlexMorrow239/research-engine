import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { memoryStorage } from 'multer';

import {
  ApiCreateApplication,
  ApiGetResume,
} from '@/common/docs/decorators/applications.decorator';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';
import { ParseFormJsonPipe } from '@/common/pipes/parse-form-json.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';
import { ApplicationsService } from './applications.service';

/**
 * Controller handling project application endpoints.
 * Manages the complete lifecycle of student applications including:
 * - Application submission with resume upload
 * - Application status management
 * - Resume download handling
 * - Application listing and filtering
 *
 * Security Features:
 * - JWT authentication for protected routes
 * - File type validation
 * - File size limits
 * - Professor ownership validation
 * - Secure resume downloads
 *
 * Base Route: /projects/:projectId/applications
 */
@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  //#region Application Submission

  /**
   * Creates a new application for a project.
   * Handles multipart form data with JSON application details and resume file.
   *
   * Security:
   * - Validates file type (PDF, DOC, DOCX)
   * - Limits file size to 5MB
   * - Stores file in memory temporarily
   *
   * @route POST /projects/:projectId/applications
   * @param projectId - Target project identifier
   * @param applicationData - JSON application details
   * @param resume - Resume file (PDF, DOC, DOCX)
   * @throws BadRequestException for invalid file type or size
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiCreateApplication()
  async create(
    @Param('projectId') projectId: string,
    @Body('application', new ParseFormJsonPipe()) applicationData: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(pdf|doc|docx)$/i,
          }),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5MB
          }),
        ],
      }),
    )
    resume: Express.Multer.File,
  ) {
    const createApplicationDto: CreateApplicationDto = {
      projectId,
      studentInfo: applicationData.studentInfo,
      availability: applicationData.availability,
      additionalInfo: applicationData.additionalInfo,
    };

    return await this.applicationsService.create(createApplicationDto, resume);
  }

  //#endregion

  //#region Application Retrieval

  /**
   * Retrieves all applications for a specific project.
   * Optionally filters by application status.
   * Requires professor authentication and ownership.
   *
   * @route GET /projects/:projectId/applications
   * @security JWT
   * @param projectId - Project identifier
   * @param professor - Authenticated professor from JWT
   * @param status - Optional status filter
   * @throws NotFoundException if project not found or not owned
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('projectId') projectId: string,
    @GetProfessor() professor: Professor,
    @Query('status') status?: ApplicationStatus,
  ) {
    return await this.applicationsService.findProjectApplications(professor.id, projectId, status);
  }

  //#endregion

  //#region Status Management

  /**
   * Updates the status of an application.
   * Requires professor authentication and ownership.
   *
   * @route PATCH /projects/:projectId/applications/:applicationId/status
   * @security JWT
   * @param applicationId - Application identifier
   * @param professor - Authenticated professor from JWT
   * @param updateStatusDto - New status information
   * @throws NotFoundException if application not found or not owned
   */
  @Patch(':applicationId/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return await this.applicationsService.updateStatus(
      professor.id,
      applicationId,
      updateStatusDto.status,
    );
  }

  //#endregion

  //#region Resume Management

  /**
   * Handles secure resume download for an application.
   * Proxies the S3 download through the server.
   * Requires professor authentication and ownership.
   *
   * Security:
   * - Validates professor ownership
   * - Uses temporary S3 URLs
   * - Sets appropriate content headers
   *
   * @route GET /projects/:projectId/applications/:applicationId/resume
   * @security JWT
   * @param applicationId - Application identifier
   * @param professor - Authenticated professor from JWT
   * @param res - Express response object for streaming
   * @throws NotFoundException if application or resume not found
   * @throws InternalServerErrorException for download failures
   */
  @Get(':applicationId/resume')
  @UseGuards(JwtAuthGuard)
  @ApiGetResume()
  async downloadResume(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Res() res: Response,
  ) {
    try {
      const fileData = await this.applicationsService.getResume(professor.id, applicationId);

      // Proxy the request to S3 instead of redirecting
      const response = await fetch(fileData.url);
      const buffer = await response.arrayBuffer();

      res
        .status(HttpStatus.OK)
        .setHeader('Content-Type', fileData.mimeType)
        .setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`)
        .send(Buffer.from(buffer));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error downloading resume');
    }
  }

  //#endregion
}
