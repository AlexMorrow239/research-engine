import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@/common/dto/projects';
import { ProjectStatus } from '@/common/enums';

import { ProjectDescriptions } from '../descriptions/projects.description';
import { createProjectExamples, updateProjectExamples } from '../examples/project.examples';

export const ApiCreateProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.create),
    ApiBody({
      type: CreateProjectDto,
      examples: createProjectExamples,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: ProjectDescriptions.responses.created,
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
  );

export const ApiFindAllProjects = () =>
  applyDecorators(
    ApiOperation(ProjectDescriptions.findAll),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'departments',
      required: false,
      type: String,
      description: 'Filter by professor departments (comma-separated)',
      example: 'Computer Science,Electrical Engineering',
    }),
    ApiQuery({
      name: 'campus',
      required: false,
      type: String,
      description: 'Filter by campus',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search in title and description',
      example: 'machine learning',
    }),
    ApiQuery({
      name: 'researchCategories',
      required: false,
      type: [String],
      isArray: true,
      description: 'Filter by research categories',
      example: ['Machine Learning', 'Computer Vision'],
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      enum: ['createdAt', 'applicationDeadline'],
      description: 'Sort field (default: createdAt)',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order (default: desc)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      schema: {
        properties: {
          projects: {
            type: 'array',
            items: { $ref: getSchemaPath(ProjectResponseDto) },
          },
          total: {
            type: 'number',
            example: 50,
            description: 'Total number of projects matching the criteria',
          },
        },
      },
    }),
  );

export const ApiFindProfessorProjects = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.findProfessorProjects),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ProjectStatus,
      description: 'Filter by project status',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      type: [ProjectResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
  );

export const ApiFindOneProject = () =>
  applyDecorators(
    ApiOperation(ProjectDescriptions.findOne),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      type: ProjectResponseDto,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
  );

export const ApiUpdateProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.update),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      type: UpdateProjectDto,
      examples: updateProjectExamples,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.updated,
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
  );

export const ApiRemoveProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.remove),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: ProjectDescriptions.responses.deleted,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
  );

export const ApiUploadProjectFile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation(ProjectDescriptions.uploadFile),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (PDF, DOC, or DOCX)',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: ProjectDescriptions.responses.fileUploaded,
      type: ProjectFileDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidFile,
    }),
  );

export const ApiDeleteProjectFile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.deleteFile),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiParam({
      name: 'fileName',
      description: 'Name of the file to delete',
      example: 'project-description.pdf',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: ProjectDescriptions.responses.fileDeleted,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
  );

export const ApiCloseProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.closeProject),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.closed,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
  );
