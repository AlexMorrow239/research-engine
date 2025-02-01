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

@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

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

    return await this.applicationsService.create(createApplicationDto, resume);
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
  @ApiGetResume()
  async downloadResume(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Res() res: Response,
  ) {
    try {
      const fileData = await this.applicationsService.getResume(professor.id, applicationId);

      // Instead of redirecting, proxy the request to S3
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
}
