import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  MaxFileSizeValidator,
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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

import { ApplicationsService } from './applications.service';

import { ApiCreateApplication } from '@/common/docs/decorators/applications.decorator';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';
import { ParseFormJsonPipe } from '@/common/pipes/parse-form-json.pipe';

@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly logger: Logger,
  ) {}

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
    // Create the DTO with the project ID from the URL
    const createApplicationDto: CreateApplicationDto = {
      projectId,
      studentInfo: applicationData.studentInfo,
      availability: applicationData.availability,
      additionalInfo: applicationData.additionalInfo,
    };

    this.logger.debug('Processing application request', {
      projectId,
      applicationData: createApplicationDto,
      resumeFile: {
        filename: resume?.originalname,
        mimetype: resume?.mimetype,
        size: resume?.size,
      },
    });

    return this.applicationsService.create(createApplicationDto, resume);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('projectId') projectId: string,
    @GetProfessor() professor: Professor,
    @Query('status') status?: ApplicationStatus,
  ) {
    return await this.applicationsService.findProjectApplications(professor.id, projectId, status);
  }

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

  @Get(':applicationId/resume')
  @UseGuards(JwtAuthGuard)
  async downloadResume(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Res() res: Response,
  ) {
    const fileData = await this.applicationsService.getResume(professor.id, applicationId);

    // Redirect to the pre-signed URL
    return res.redirect(fileData.url);
  }

  @Delete(':applicationId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteApplication(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
  ) {
    await this.applicationsService.deleteApplication(professor.id, applicationId);
  }
}
