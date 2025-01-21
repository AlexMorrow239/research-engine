import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';

import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@common/dto/projects';

import { Professor } from '@modules/professors/schemas/professors.schema';

import { Project, ProjectStatus } from './schemas/projects.schema';

import { ApplicationStatus } from '@/common/enums';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { ApplicationsService } from '@/modules/applications/applications.service';
import { EmailService } from '@/modules/email/email.service';

// Handles research project business logic and data operations
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applicationsService: ApplicationsService,
    private readonly emailService: EmailService,
  ) {}

  // Transforms project data to response format
  private transformToProjectResponse(project: Project): ProjectResponseDto {
    try {
      if (!project) {
        throw new Error('Project data is undefined');
      }

      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        campus: project.campus,
        professor: {
          id: project.professor._id.toString(),
          name: {
            firstName: project.professor.name.firstName,
            lastName: project.professor.name.lastName,
          },
          email: project.professor.email,
          department: project.professor.department,
        },
        researchCategories: project.researchCategories,
        requirements: project.requirements,
        files: [],
        status: project.status,
        positions: project.positions,
        applicationDeadline: project.applicationDeadline,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isVisible: project.isVisible ?? true,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'transform project response', {
        projectId: project?._id,
      });
    }
  }

  // Create new research project
  async create(
    professor: Professor,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.log(`Creating project for professor ${professor._id}`);
      const project = await this.projectModel.create({
        ...createProjectDto,
        professor: professor._id,
      });

      const populatedProject = await project.populate('professor', 'name email department');
      this.logger.log(`Project created successfully by professor ${professor._id}`);

      return this.transformToProjectResponse(populatedProject);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'create project', {
        professorId: professor._id,
      });
    }
  }

  // Find projects with filters and pagination
  async findAll(query: {
    page?: number;
    limit?: number;
    department?: string;
    campus?: string;
    status?: ProjectStatus;
    search?: string;
    researchCategories?: string[];
    sortBy?: 'createdAt' | 'applicationDeadline';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        department,
        campus,
        status,
        search,
        researchCategories,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      // Build filter conditions
      const filter: any = {};
      if (status) filter.status = status;
      if (campus) filter.campus = campus;
      if (department) {
        const professors = await this.projectModel.db
          .collection('professors')
          .find({ department })
          .project({ _id: 1 })
          .toArray();
        filter.professor = { $in: professors.map((prof) => prof._id) };
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (researchCategories?.length > 0) {
        filter.researchCategories = { $in: researchCategories };
      }

      const sortOptions: { [key: string]: mongoose.SortOrder } = {
        [sortBy]: sortOrder === 'desc' ? -1 : 1,
      };

      // Execute query with pagination
      const [projects, total] = await Promise.all([
        this.projectModel
          .find(filter)
          .populate('professor', 'name department email')
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.projectModel.countDocuments(filter),
      ]);

      return {
        projects: projects.map((project) => this.transformToProjectResponse(project)),
        total,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch projects', { query });
    }
  }

  // Find single project by ID
  async findOne(id: string): Promise<ProjectResponseDto> {
    try {
      const project = await this.projectModel
        .findById(id)
        .populate('professor', 'name department email')
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return this.transformToProjectResponse(project);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch project', { projectId: id }, [
        NotFoundException,
      ]);
    }
  }

  // Update project details
  async update(
    professorId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      const updatedProject = await this.projectModel
        .findOneAndUpdate({ _id: projectId, professor: professorId }, updateProjectDto, {
          new: true,
        })
        .populate('professor', 'name department email');

      if (!updatedProject) {
        throw new NotFoundException("Project not found or you don't have permission to update it");
      }

      this.logger.log(`Project ${projectId} updated by professor ${professorId}`);
      return this.transformToProjectResponse(updatedProject);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  // Delete project and associated files
  async remove(professorId: string, projectId: string): Promise<void> {
    try {
      const project = await this.projectModel
        .findOneAndDelete({
          _id: projectId,
          professor: professorId,
        })
        .lean();

      if (!project) {
        throw new NotFoundException("Project not found or you don't have permission to delete it");
      }

      // TODO: Implement file cleanup when file storage is implemented
      this.logger.log(`Project ${projectId} deleted by professor ${professorId}`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'delete project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  // Find professor's projects with optional status filter
  async findProfessorProjects(
    professorId: string,
    status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    try {
      const projects = await this.projectModel
        .find({ professor: professorId, ...(status && { status }) })
        .populate('professor', 'name department email')
        .sort({ createdAt: -1 })
        .exec();

      return projects.map((project) => this.transformToProjectResponse(project));
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch professor projects', {
        professorId,
        status,
      });
    }
  }

  // Placeholder for future file upload implementation
  async addProjectFile(
    professorId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<ProjectFileDto> {
    this.logger.log('File upload functionality is not implemented yet');
    return {
      fileName: 'placeholder',
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };
  }

  // Placeholder for future file removal implementation
  async removeProjectFile(professorId: string, projectId: string, fileName: string): Promise<void> {
    this.logger.log('File removal functionality is not implemented yet');
  }

  // Close project and notify applicants
  async closeProject(professorId: string, projectId: string): Promise<void> {
    try {
      const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
      });

      if (!project) {
        throw new NotFoundException("Project not found or you don't have permission to modify it");
      }

      await this.projectModel.findByIdAndUpdate(projectId, {
        status: ProjectStatus.CLOSED,
        isVisible: false,
      });

      const applications = await this.applicationsService.findProjectApplications(
        professorId,
        projectId,
        ApplicationStatus.PENDING,
      );

      await Promise.all([
        this.applicationsService.closeProjectApplications(projectId),
        ...applications.map((application) =>
          this.emailService.sendProjectClosedNotification(
            application.studentInfo.email,
            project.title,
          ),
        ),
      ]);

      this.logger.log(`Project ${projectId} closed by professor ${professorId}`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'close project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }
}
