import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ApplicationStatus } from '@/common/enums';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { ApplicationsService } from '@/modules/applications/applications.service';
import { EmailService } from '@/modules/email/email.service';
import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@common/dto/projects';
import { Professor } from '@modules/professors/schemas/professors.schema';
import { Project, ProjectStatus } from './schemas/projects.schema';
import { CustomLogger } from '@/common/services/logger.service';

/**
 * Service responsible for managing research projects in the system.
 * Handles the complete lifecycle of projects including creation, updates, search, and deletion.
 *
 * Projects can be in different states:
 * - DRAFT: Initial state when created
 * - PUBLISHED: Visible to students and accepting applications
 * - CLOSED: No longer accepting applications
 *
 * Access Control:
 * - Public: Can view all PUBLISHED projects
 * - Professor: Can manage only their own projects
 * - System: Can automatically close expired projects
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applicationsService: ApplicationsService,
    private readonly emailService: EmailService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('ProjectsService');
  }

  //#region Data Transformation

  /**
   * Transforms a Project document into a ProjectResponseDto.
   * Handles data mapping and ensures consistent response format.
   */
  private transformToProjectResponse(project: Project): ProjectResponseDto {
    try {
      if (!project) {
        throw new Error('Project data is undefined');
      }

      const response = {
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
        isVisible: true,
      };

      this.logger.logObject('debug', { projectId: project._id }, 'Transformed project response');
      return response;
    } catch (error) {
      this.logger.error('Failed to transform project response', error);
      throw error;
    }
  }

  //#endregion

  //#region Project Creation and Basic Operations

  /**
   * Creates a new research project for a professor.
   * Initial state is DRAFT by default.
   */
  async create(
    professor: Professor,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.log(`Creating new project for professor ${professor._id}`);
      const project = await this.projectModel.create({
        ...createProjectDto,
        professor: professor._id,
      });

      const populatedProject = await project.populate('professor', 'name email department');
      this.logger.logObject(
        'debug',
        {
          projectId: project._id,
          professorId: professor._id,
        },
        'Project created successfully',
      );
      return this.transformToProjectResponse(populatedProject);
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'create project',
        { professorId: professor._id },
        [NotFoundException],
      );
    }
  }

  /**
   * Updates an existing project.
   * Only the professor who created the project can update it.
   */
  async update(
    professorId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.logObject(
        'debug',
        {
          projectId,
          professorId,
          updates: updateProjectDto,
        },
        'Attempting to update project',
      );

      const updatedProject = await this.projectModel
        .findOneAndUpdate({ _id: projectId, professor: professorId }, updateProjectDto, {
          new: true,
        })
        .populate('professor', 'name department email');

      if (!updatedProject) {
        this.logger.logObject(
          'warn',
          { projectId, professorId },
          'Project not found or unauthorized',
        );
        throw new NotFoundException("Project not found or you don't have permission to update it");
      }

      this.logger.logObject(
        'debug',
        {
          projectId,
          professorId,
        },
        'Project updated successfully',
      );

      return this.transformToProjectResponse(updatedProject);
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  /**
   * Permanently removes a project from the database.
   * Can only be done if:
   * 1. Project is in DRAFT state, or
   * 2. Project is CLOSED
   */
  async remove(professorId: string, projectId: string): Promise<void> {
    try {
      this.logger.logObject('debug', { projectId, professorId }, 'Attempting to delete project');

      const project = await this.projectModel
        .findOneAndDelete({
          _id: projectId,
          professor: professorId,
        })
        .lean();

      if (!project) {
        this.logger.logObject(
          'warn',
          { projectId, professorId },
          'Project not found or unauthorized for deletion',
        );
        throw new NotFoundException("Project not found or you don't have permission to delete it");
      }

      // TODO: Implement file cleanup when file storage is implemented
      this.logger.logObject('debug', { projectId, professorId }, 'Project deleted successfully');
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'delete project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  //#endregion

  //#region Project Retrieval and Search

  /**
   * Finds all PUBLISHED projects with optional filtering and sorting.
   * This is the main method used by the public project listing page.
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    departments?: string;
    campus?: string;
    search?: string;
    researchCategories?: string[];
    sortBy?: 'createdAt' | 'applicationDeadline';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    try {
      this.logger.logObject('debug', { query }, 'Fetching projects with query');

      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

      const filter = await this.buildFilterConditions(query);
      const sortOptions = this.buildSortOptions(sortBy, sortOrder);

      this.logger.debug('Filter conditions:', filter);

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

      this.logger.logObject(
        'debug',
        { count: projects.length, total, filter },
        'Projects fetched successfully',
      );

      return {
        projects: projects.map((project) => this.transformToProjectResponse(project)),
        total,
      };
    } catch (error) {
      throw ErrorHandler.handleServiceError(this.logger, error, 'fetch projects', {
        query,
      });
    }
  }

  /**
   * Retrieves a single project by ID.
   * Used for displaying detailed project information.
   */
  async findOne(id: string): Promise<ProjectResponseDto> {
    try {
      this.logger.logObject('debug', { projectId: id }, 'Fetching project by ID');

      const project = await this.projectModel
        .findById(id)
        .populate('professor', 'name department email')
        .exec();

      if (!project) {
        this.logger.logObject('warn', { projectId: id }, 'Project not found');
        throw new NotFoundException('Project not found');
      }

      this.logger.logObject(
        'debug',
        {
          projectId: id,
          professorId: project.professor._id,
        },
        'Project found successfully',
      );

      return this.transformToProjectResponse(project);
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'fetch project',
        { projectId: id },
        [NotFoundException],
      );
    }
  }

  /**
   * Retrieves all projects created by a specific professor.
   * Optionally filtered by project status.
   */
  async findProfessorProjects(
    professorId: string,
    status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    try {
      this.logger.logObject('debug', { professorId, status }, 'Fetching professor projects');

      const projects = await this.projectModel
        .find({ professor: professorId, ...(status && { status }) })
        .populate('professor', 'name department email')
        .sort({ createdAt: -1 })
        .exec();

      this.logger.logObject(
        'debug',
        {
          professorId,
          projectCount: projects.length,
          status,
        },
        'Professor projects fetched successfully',
      );

      return projects.map((project) => this.transformToProjectResponse(project));
    } catch (error) {
      throw ErrorHandler.handleServiceError(this.logger, error, 'fetch professor projects', {
        professorId,
        status,
      });
    }
  }

  //#endregion

  //#region Search Helper Methods

  /**
   * Builds MongoDB filter conditions based on search criteria.
   * Supports filtering by department, campus, search terms, and research categories.
   */
  private async buildFilterConditions(query: {
    departments?: string;
    campus?: string;
    search?: string;
    researchCategories?: string[];
  }): Promise<any> {
    const filter: any = {
      status: ProjectStatus.PUBLISHED,
    };

    if (query.campus) filter.campus = query.campus;

    if (query.departments) {
      const departmentsList = query.departments.split(',');
      const professors = await this.projectModel.db
        .collection('professors')
        .find({ department: { $in: departmentsList } })
        .project({ _id: 1 })
        .toArray();
      filter.professor = { $in: professors.map((prof) => prof._id) };
    }

    if (query.search) {
      const searchFilter = await this.buildSearchFilter(query.search);
      filter.$or = searchFilter;
    }

    if (query.researchCategories?.length > 0) {
      filter.researchCategories = { $in: query.researchCategories };
    }

    this.logger.logObject('debug', { filter }, 'Built project filter');
    return filter;
  }

  /**
   * Builds search filter for text-based search across multiple fields.
   * Searches project title, description, requirements, and professor names.
   */
  private async buildSearchFilter(search: string): Promise<any[]> {
    const escapeRegex = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    const searchTerms = search
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map(escapeRegex);

    this.logger.logObject('debug', { searchTerms }, 'Processing search terms');

    const professorQuery =
      searchTerms.length > 1
        ? {
            $and: searchTerms.map((term) => ({
              $or: [
                { 'name.firstName': { $regex: term, $options: 'i' } },
                { 'name.lastName': { $regex: term, $options: 'i' } },
              ],
            })),
          }
        : {
            $or: [
              { 'name.firstName': { $regex: searchTerms[0], $options: 'i' } },
              { 'name.lastName': { $regex: searchTerms[0], $options: 'i' } },
            ],
          };

    const professorIds = await this.projectModel.db
      .collection('professors')
      .find(professorQuery)
      .project({ _id: 1 })
      .toArray();

    this.logger.logObject(
      'debug',
      {
        matchedProfessors: professorIds.length,
        query: professorQuery,
      },
      'Professor search results',
    );

    const searchFilter = [
      { title: { $regex: escapeRegex(search), $options: 'i' } },
      { description: { $regex: escapeRegex(search), $options: 'i' } },
      { requirements: { $regex: escapeRegex(search), $options: 'i' } },
      { professor: { $in: professorIds.map((prof) => prof._id) } },
    ];

    return searchFilter;
  }

  /**
   * Builds sort options for query results.
   */
  private buildSortOptions(
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): { [key: string]: mongoose.SortOrder } {
    const sortOptions = {
      [sortBy]: (sortOrder === 'desc' ? -1 : 1) as mongoose.SortOrder,
    };

    this.logger.logObject('debug', { sortBy, sortOrder, sortOptions }, 'Building sort options');
    return sortOptions;
  }

  //#endregion

  //#region Project Status Management

  /**
   * Closes a project manually.
   * Only the professor who created the project can close it.
   * Sends notifications to all applicants with pending applications.
   */
  async closeProject(professorId: string, projectId: string): Promise<void> {
    try {
      this.logger.logObject('debug', { projectId, professorId }, 'Attempting to close project');

      const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
      });

      if (!project) {
        this.logger.logObject(
          'warn',
          { projectId, professorId },
          'Project not found or unauthorized',
        );
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

      this.logger.logObject(
        'debug',
        {
          projectId,
          pendingApplications: applications.length,
        },
        'Processing pending applications',
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

      this.logger.logObject('debug', { projectId, professorId }, 'Project closed successfully');
    } catch (error) {
      throw ErrorHandler.handleServiceError(
        this.logger,
        error,
        'close project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  /**
   * Automatically closes all projects that have passed their application deadline.
   * Run periodically by a scheduled task.
   * Notifies all applicants with pending applications.
   */
  async closeExpiredProjects(): Promise<void> {
    try {
      const now = new Date();
      this.logger.debug('Starting expired projects cleanup');

      const expiredProjects = await this.projectModel.find({
        status: ProjectStatus.PUBLISHED,
        applicationDeadline: { $lt: now },
      });

      this.logger.logObject(
        'debug',
        {
          expiredProjectsCount: expiredProjects.length,
        },
        'Found expired projects',
      );

      // Process each expired project
      await Promise.all(
        expiredProjects.map(async (project) => {
          this.logger.logObject(
            'debug',
            {
              projectId: project._id,
              professorId: project.professor,
            },
            'Processing expired project',
          );

          // Update project status
          await this.projectModel.findByIdAndUpdate(project._id, {
            status: ProjectStatus.CLOSED,
            isVisible: false,
          });

          // Find pending applications
          const applications = await this.applicationsService.findProjectApplications(
            project.professor.toString(),
            project._id.toString(),
            ApplicationStatus.PENDING,
          );

          this.logger.logObject(
            'debug',
            {
              projectId: project._id,
              pendingApplications: applications.length,
            },
            'Processing pending applications for expired project',
          );

          // Close applications and send notifications
          await Promise.all([
            this.applicationsService.closeProjectApplications(project._id.toString()),
            ...applications.map((application) =>
              this.emailService.sendProjectClosedNotification(
                application.studentInfo.email,
                project.title,
              ),
            ),
          ]);

          this.logger.logObject(
            'debug',
            {
              projectId: project._id,
            },
            'Successfully closed expired project',
          );
        }),
      );

      this.logger.logObject(
        'debug',
        {
          processedCount: expiredProjects.length,
        },
        'Completed expired projects cleanup',
      );
    } catch (error) {
      throw ErrorHandler.handleServiceError(this.logger, error, 'close expired projects');
    }
  }

  //#endregion

  //#region File Management

  /**
   * Adds a file to a project.
   * Only the professor who created the project can add files.
   * TODO: Implement actual file storage.
   */
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

  /**
   * Removes a file from a project.
   * Only the professor who created the project can remove files.
   * TODO: Implement actual file removal.
   */
  async removeProjectFile(professorId: string, projectId: string, fileName: string): Promise<void> {
    this.logger.log('File removal functionality is not implemented yet');
  }

  //#endregion
}
